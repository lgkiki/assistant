// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use tauri::{Manager, State};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct PomodoroState {
    is_running: bool,
    is_paused: bool,
    remaining_seconds: u64,
    total_seconds: u64,
    start_time: Option<Instant>,
}

impl Default for PomodoroState {
    fn default() -> Self {
        Self {
            is_running: false,
            is_paused: false,
            remaining_seconds: 25 * 60, // 25分钟
            total_seconds: 25 * 60,
            start_time: None,
        }
    }
}

type PomodoroStateMutex = Arc<Mutex<PomodoroState>>;

// 获取当前状态
#[tauri::command]
fn get_state(state: State<'_, PomodoroStateMutex>) -> Result<PomodoroState, String> {
    let mut state = state.lock().map_err(|e| e.to_string())?;
    let mut current_state = state.clone();

    // 如果正在运行且未暂停，计算剩余时间
    if current_state.is_running && !current_state.is_paused {
        if let Some(start_time) = current_state.start_time {
            let elapsed = start_time.elapsed().as_secs();
            if elapsed >= current_state.remaining_seconds {
                current_state.remaining_seconds = 0;
                current_state.is_running = false;
                current_state.start_time = None;
            } else {
                current_state.remaining_seconds -= elapsed;
                // 更新状态中的开始时间，避免重复计算
                state.start_time = Some(Instant::now());
                state.remaining_seconds = current_state.remaining_seconds;
            }
        }
    }

    Ok(current_state)
}

// 开始计时
#[tauri::command]
fn start_timer(state: State<'_, PomodoroStateMutex>) -> Result<(), String> {
    let mut state = state.lock().map_err(|e| e.to_string())?;

    if !state.is_running {
        state.is_running = true;
        state.is_paused = false;
        state.start_time = Some(Instant::now());
    } else if state.is_paused {
        // 从暂停状态恢复
        state.is_paused = false;
        state.start_time = Some(Instant::now());
    }

    Ok(())
}

// 暂停计时
#[tauri::command]
fn pause_timer(state: State<'_, PomodoroStateMutex>) -> Result<(), String> {
    let mut state = state.lock().map_err(|e| e.to_string())?;

    if state.is_running && !state.is_paused {
        // 更新剩余时间
        if let Some(start_time) = state.start_time {
            let elapsed = start_time.elapsed().as_secs();
            if elapsed >= state.remaining_seconds {
                state.remaining_seconds = 0;
            } else {
                state.remaining_seconds -= elapsed;
            }
        }
        state.is_paused = true;
        state.start_time = None;
    }

    Ok(())
}

// 重置计时
#[tauri::command]
fn reset_timer(state: State<'_, PomodoroStateMutex>) -> Result<(), String> {
    let mut state = state.lock().map_err(|e| e.to_string())?;

    state.is_running = false;
    state.is_paused = false;
    state.remaining_seconds = state.total_seconds;
    state.start_time = None;

    Ok(())
}

// 设置时间（秒）
#[tauri::command]
fn set_time(state: State<'_, PomodoroStateMutex>, seconds: u64) -> Result<(), String> {
    let mut state = state.lock().map_err(|e| e.to_string())?;

    if !state.is_running {
        state.total_seconds = seconds;
        state.remaining_seconds = seconds;
    }

    Ok(())
}

fn main() {
    let pomodoro_state: PomodoroStateMutex = Arc::new(Mutex::new(PomodoroState::default()));

    tauri::Builder::default()
        .manage(pomodoro_state)
        .invoke_handler(tauri::generate_handler![
            get_state,
            start_timer,
            pause_timer,
            reset_timer,
            set_time
        ])
        .setup(|app| {
            let app_handle = app.handle().clone();
            let state = app.state::<PomodoroStateMutex>();

            // 启动一个后台任务来检查计时器状态
            tauri::async_runtime::spawn(async move {
                let mut interval = tokio::time::interval(Duration::from_millis(100));
                loop {
                    interval.tick().await;

                    let should_notify = {
                        let mut state = state.lock().unwrap();
                        if state.is_running && !state.is_paused && state.start_time.is_some() {
                            let elapsed = state.start_time.unwrap().elapsed().as_secs();
                            if elapsed >= state.remaining_seconds {
                                state.remaining_seconds = 0;
                                state.is_running = false;
                                state.start_time = None;
                                true
                            } else {
                                false
                            }
                        } else {
                            false
                        }
                    };

                    if should_notify {
                        // 发送通知
                        #[cfg(desktop)]
                        {
                            use tauri::api::notification::Notification;
                            if let Err(e) = Notification::new(&app_handle)
                                .title("番茄钟")
                                .body("时间到了！该休息一下了。")
                                .show() {
                                eprintln!("通知发送失败: {}", e);
                            }
                        }

                        // 发送事件到前端
                        let _ = app_handle.emit_all("timer-finished", ());
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
