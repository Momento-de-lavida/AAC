import { AppError, err, ok, Result } from '../types/common';
import { VOICE_RECORD_CONFIG } from '../utils/constants';

/**
 * @description 진행 중인 아동 음성 녹음 세션 인터페이스
 */
export interface ActiveRecordingSession {
  readonly recorder: MediaRecorder;
  readonly stream: MediaStream;
  readonly chunks: Blob[];
}

/** 브라우저 및 오디오 드라이버 호환성을 보장하여 MediaRecorder를 생성하는 내부 헬퍼 */
function createCompatibleMediaRecorder(stream: MediaStream): MediaRecorder {
  if (typeof MediaRecorder.isTypeSupported === 'function') {
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
    const mimeType = candidates.find((type) => MediaRecorder.isTypeSupported(type));
    if (mimeType) {
      try {
        return new MediaRecorder(stream, { mimeType, audioBitsPerSecond: VOICE_RECORD_CONFIG.AUDIO_BITS_PER_SECOND });
      } catch {
        // 특정 드라이버에서 비트레이트 옵션 거부 시 기본 설정으로 폴백
      }
    }
  }
  return new MediaRecorder(stream);
}

/** Blob 객체를 Base64 Data URL로 변환하는 내부 헬퍼 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => (typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('READ_FAIL')));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * @description [HR-04, HR-05] 마이크 권한을 요청하고 아동 음성 녹음 세션을 시작하는 비동기 서비스 함수
 * @returns {Promise<Result<ActiveRecordingSession, AppError>>} 녹음 세션 또는 한국어 안내 에러 반환
 */
export async function startAudioRecordingSession(): Promise<Result<ActiveRecordingSession, AppError>> {
  try {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      return err(
        'AUDIO_RECORD_NOT_SUPPORTED',
        '현재 접속 주소에서 실시간 마이크가 제한되어 있어요. localhost로 접속하거나 우측 [녹음 파일·기기 녹음기] 버튼을 이용해 주세요.'
      );
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = createCompatibleMediaRecorder(stream);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) chunks.push(event.data);
    };
    recorder.start(100);
    return ok({ recorder, stream, chunks });
  } catch (error: unknown) {
    return err(
      'MIC_ACCESS_DENIED',
      '마이크 권한이 거부되었거나 연결된 마이크가 없어요. 마이크 권한을 허용하거나 [녹음 파일·기기 녹음기] 버튼을 눌러주세요.',
      error
    );
  }
}

/**
 * @description [HR-04, HR-05] 진행 중인 녹음 세션을 종료하고 오디오 데이터를 Base64 Data URL로 변환하는 함수
 * @param {ActiveRecordingSession} session 종료할 활성 녹음 세션
 * @returns {Promise<Result<string, AppError>>} 변환된 오디오 Data URL 결과 객체
 */
export async function stopAudioRecordingSession(session: ActiveRecordingSession): Promise<Result<string, AppError>> {
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const finalizeBlob = (): void => {
        session.stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(session.chunks, { type: session.recorder.mimeType || 'audio/webm' });
        if (audioBlob.size === 0) {
          reject(new Error('EMPTY_AUDIO_BLOB'));
          return;
        }
        blobToDataUrl(audioBlob).then(resolve).catch(reject);
      };
      if (session.recorder.state !== 'inactive') {
        session.recorder.onstop = finalizeBlob;
        try { session.recorder.requestData(); } catch { /* ignore */ }
        session.recorder.stop();
      } else {
        finalizeBlob();
      }
    });
    return ok(dataUrl);
  } catch (error: unknown) {
    session.stream.getTracks().forEach((track) => track.stop());
    return err('AUDIO_STOP_FAILED', '음성이 너무 짧거나 저장하는 중 오류가 발생했어요. 다시 한 번 녹음해 주세요.', error);
  }
}

/**
 * @description [HR-04, HR-05] 모방발화 유도 중 치료사의 시범(모델링) 음성이 녹음되지 않도록 세션을 일시정지하는 함수
 * @param {ActiveRecordingSession | null} session 일시정지할 활성 녹음 세션
 * @returns {Result<void, AppError>} 일시정지 처리 결과 객체
 */
export function pauseAudioRecordingSession(session: ActiveRecordingSession | null): Result<void, AppError> {
  try {
    if (!session || session.recorder.state !== 'recording') {
      return err('AUDIO_PAUSE_INVALID', '현재 진행 중인 녹음이 없어요.');
    }
    try { session.recorder.requestData(); } catch { /* ignore */ }
    session.recorder.pause();
    return ok(undefined);
  } catch (error: unknown) {
    return err('AUDIO_PAUSE_FAILED', '녹음 일시정지 중 오류가 발생했어요.', error);
  }
}

/**
 * @description [HR-04, HR-05] 치료사의 시범 발화 후 아동이 따라 말할 때 일시정지된 녹음 세션을 다시 이어서 진행하는 함수
 * @param {ActiveRecordingSession | null} session 재개할 활성 녹음 세션
 * @returns {Result<void, AppError>} 녹음 재개 처리 결과 객체
 */
export function resumeAudioRecordingSession(session: ActiveRecordingSession | null): Result<void, AppError> {
  try {
    if (!session || session.recorder.state !== 'paused') {
      return err('AUDIO_RESUME_INVALID', '일시정지된 녹음이 없어요.');
    }
    session.recorder.resume();
    return ok(undefined);
  } catch (error: unknown) {
    return err('AUDIO_RESUME_FAILED', '녹음 다시 시작 중 오류가 발생했어요.', error);
  }
}

/**
 * @description [HR-04, HR-05] 기기 녹음기 또는 오디오 파일을 읽어 Data URL로 변환하는 함수
 * @param {File} file 사용자가 선택한 오디오 파일
 * @returns {Promise<Result<string, AppError>>} 변환된 오디오 Data URL 결과 객체
 */
export async function processAudioFile(file: File): Promise<Result<string, AppError>> {
  try {
    return ok(await blobToDataUrl(file));
  } catch (error: unknown) {
    return err('AUDIO_FILE_FAILED', '음성 파일을 불러오는 중 오류가 발생했어요.', error);
  }
}

/**
 * @description [HR-04, HR-05] 녹음 세션을 저장 없이 즉시 중단하고 마이크 스트림을 해제하는 함수
 * @param {ActiveRecordingSession | null} session 중단할 녹음 세션
 * @returns {Result<void, AppError>} 중단 결과 객체
 */
export function abortAudioRecordingSession(session: ActiveRecordingSession | null): Result<void, AppError> {
  try {
    if (session) {
      if (session.recorder.state !== 'inactive') {
        session.recorder.onstop = null;
        session.recorder.stop();
      }
      session.stream.getTracks().forEach((track) => track.stop());
    }
    return ok(undefined);
  } catch (error: unknown) {
    return err('AUDIO_ABORT_FAILED', '녹음 중단 중 오류가 발생했어요.', error);
  }
}

/**
 * @description [HR-04, HR-05] 저장된 아동 음성 Data URL을 재생하는 함수
 * @param {string} dataUrl 재생할 오디오 Data URL
 * @param {() => void} onEnded 재생 종료 시 실행할 콜백 (선택)
 * @returns {Result<HTMLAudioElement, AppError>} 생성된 오디오 엘리먼트 결과 객체
 */
export function playAudioDataUrl(dataUrl: string, onEnded?: () => void): Result<HTMLAudioElement, AppError> {
  try {
    const audio = new Audio(dataUrl);
    audio.onended = () => onEnded?.();
    audio.onerror = () => onEnded?.();
    void audio.play().catch(() => onEnded?.());
    return ok(audio);
  } catch (error: unknown) {
    onEnded?.();
    return err('AUDIO_PLAY_FAILED', '녹음된 음성을 재생할 수 없어요.', error);
  }
}

/**
 * @description [HR-04, HR-05] 재생 중인 오디오 엘리먼트를 안전하게 정지하는 함수
 * @param {HTMLAudioElement | null} audio 정지할 오디오 엘리먼트
 * @returns {Result<void, AppError>} 정지 결과 객체
 */
export function stopAudioElement(audio: HTMLAudioElement | null): Result<void, AppError> {
  try {
    if (audio) { audio.pause(); audio.currentTime = 0; }
    return ok(undefined);
  } catch (error: unknown) {
    return err('AUDIO_STOP_ELEMENT_FAILED', '오디오 정지 중 오류가 발생했어요.', error);
  }
}
