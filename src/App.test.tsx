import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { VoiceRecordBar } from './components/VoiceRecordBar';
import { pauseAudioRecordingSession, resumeAudioRecordingSession } from './services/audioRecordService';
import { useAacStore } from './store/useAacStore';
import { ok, err } from './types/common';
import { DEFAULT_FAVORITE_SENTENCES } from './utils/aacTemplates';

/**
 * @description Phase 7 & 결합 동작 스테이지:
 * 1) 명사 단독 제시 -> 2) 동사 활성화 -> 3) [빵+먹어요 카드 조합] 제시 후 [실제로 빵을 먹는 하나의 통합 동작 그림] 제시 검증
 */
describe('마음톡톡 AAC 의사소통 보드 단계별 집중 UI 및 통합 동작 그림 검증', () => {
  beforeEach(() => {
    useAacStore.setState({
      activeProfileId: 'child-daon',
      isProfileModalOpen: false,
      activeChapter: 'food',
      activeCategory: 'food',
      selectedCards: [],
      customCards: [],
      favoriteSentences: [...DEFAULT_FAVORITE_SENTENCES],
    });
  });

  it('앱 최초 진입 또는 설정 내 이용자 변경 클릭 시 아동(이용자) 선택 모달이 열리고 이용자를 전환할 수 있어야 한다', () => {
    useAacStore.setState({ isProfileModalOpen: true });
    render(<App />);

    expect(screen.getByText(/수업할 이용자\(아동\) 선택 및 관리/i)).toBeInTheDocument();
    const hajunProfileBtn = screen.getByLabelText('하준이 이용자 선택');
    fireEvent.click(hajunProfileBtn);

    expect(useAacStore.getState().activeProfileId).toBe('child-hajun');
    expect(screen.getAllByText(/하준이/).length).toBeGreaterThan(0);
  });

  it('초기 1단계에서는 아동 집중도 향상을 위해 상단 진행 바 없이 명사 보드만 단독 제시되고 동사 보드는 숨겨져 있어야 한다', () => {
    render(<App />);

    expect(screen.getByText('마음톡톡 AAC')).toBeInTheDocument();
    expect(screen.queryByLabelText('단계별 페이지 전환 네비게이션')).not.toBeInTheDocument();
    expect(screen.getByLabelText('명사 어휘 보드')).toBeInTheDocument();
    expect(screen.queryByLabelText('동사 동작 보드')).not.toBeInTheDocument();
  });

  it('명사 "빵" 선택 후 동사 "먹어요" 선택 시 각 단계별로 이전 보드가 숨겨지고 단독 페이지로 전환되어야 한다', () => {
    render(<App />);

    // 1. 명사 '빵' 선택 -> 1단계 명사 보드는 사라지고 2단계 동사 보드 단독 페이지로 전환
    fireEvent.click(screen.getByLabelText('빵 카드'));
    expect(screen.queryByLabelText('명사 어휘 보드')).not.toBeInTheDocument();
    expect(screen.getByLabelText('동사 동작 보드')).toBeInTheDocument();

    // 1페이지 고빈도 동사(타요, 꺼내요, 뜯어요, 가요, 열어요) 확인
    expect(screen.getByLabelText('타요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('꺼내요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('뜯어요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('가요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('열어요 카드')).toBeInTheDocument();

    // 2. 동사 '먹어요' 선택 -> 2단계 동사 보드도 사라지고 3단계 결합 학습 스테이지 단독 페이지로 전환
    fireEvent.click(screen.getByLabelText('먹어요 카드'));
    expect(screen.queryByLabelText('명사 어휘 보드')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('동사 동작 보드')).not.toBeInTheDocument();
    expect(screen.getByLabelText('명사 동사 결합 학습 스테이지')).toBeInTheDocument();
    expect(screen.getByLabelText('두 카드 조합 제시 화면')).toBeInTheDocument();
    expect(screen.getByLabelText('아동 음성 녹음 컨트롤 바')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /아동 음성 녹음하기/i })).toBeInTheDocument();

    // 3. 4단계: 하나로 합쳐진 실제 동작 그림('빵 먹어요 통합 동작 그림') 단독 페이지 전환 확인
    const mergedStageBtn = screen.getByRole('button', { name: /하나로 합쳐진 실제 동작 그림/i });
    fireEvent.click(mergedStageBtn);
    expect(screen.getByLabelText('하나로 결합된 실제 동작 화면')).toBeInTheDocument();
    expect(screen.getByLabelText('빵 먹어요 통합 동작 그림')).toBeInTheDocument();

    // 4. [동사 다시 고르기] 클릭 시 2단계 동사 보드 단독 페이지로 역이동 확인
    fireEvent.click(screen.getByRole('button', { name: /동사 다시 고르기/i }));
    expect(screen.queryByLabelText('명사 동사 결합 학습 스테이지')).not.toBeInTheDocument();
    expect(screen.getByLabelText('동사 동작 보드')).toBeInTheDocument();

    // 5. [명사 다시 고르기] 클릭 시 1단계 명사 보드 단독 페이지로 복귀 확인
    fireEvent.click(screen.getByRole('button', { name: /명사 다시 고르기/i }));
    expect(screen.queryByLabelText('동사 동작 보드')).not.toBeInTheDocument();
    expect(screen.getByLabelText('명사 어휘 보드')).toBeInTheDocument();
  });

  it('즐겨찾기 챕터로 전환하면 저장된 자주 쓰는 표현을 모아 보고 즉시 실행할 수 있어야 한다', () => {
    render(<App />);

    const favChapterBtn = screen.getByRole('button', { name: /즐겨찾기/i });
    fireEvent.click(favChapterBtn);

    expect(screen.getByLabelText('즐겨찾기 표현 보드')).toBeInTheDocument();
    expect(screen.getByLabelText('즐겨찾기 표현 빵 주세요')).toBeInTheDocument();
  });

  it('놀이·장난감 카테고리에 모든 어휘(그네, 트램폴린, 자전거, 노래, 비눗방울 등)가 페이지 넘김 없이 한 화면에 제시되고 동사 화면에서도 전체 동사가 한 화면에 제시되어야 한다', () => {
    useAacStore.setState({ activeChapter: 'play', activeCategory: 'play', selectedCards: [] });
    render(<App />);

    expect(screen.getByLabelText('그네 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('트램폴린 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('자전거 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('노래 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('비눗방울 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('퍼즐 카드')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('노래 카드'));

    expect(screen.getByLabelText('틀어주세요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('만지지 마세요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('좋아요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('맛있어요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('재밌어요 카드')).toBeInTheDocument();
  });

  it('아동 화면에는 치료사 전용 버튼이 숨겨지고 "설정" 버튼을 눌렀을 때 이용자 변경 및 새 카드 만들기를 열 수 있어야 한다', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /치료사 설정/i }));
    expect(screen.getByText(/치료사 전용 설정 및 관리/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /이용자 변경·관리/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /새 카드 만들기/i }));
    expect(screen.getByText(/아동 맞춤형 새 어휘·동작 카드 만들기/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /사진첩에서 사진·GIF 고르기/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /실시간 카메라로 찍기/i })).toBeInTheDocument();
  });

  it('아동 음성 녹음 중 치료사 시범 발화를 위한 일시정지 및 이어서 녹음 버튼이 정상 동작해야 한다', () => {
    const onPause = vi.fn();
    const onResume = vi.fn();
    const { rerender } = render(
      <VoiceRecordBar
        sentenceText="빵 먹어요"
        hasRecordedVoice={false}
        isRecording={true}
        isRecordingPaused={false}
        isPlayingRecordedVoice={false}
        recordError={null}
        onStartRecording={vi.fn()}
        onPauseRecording={onPause}
        onResumeRecording={onResume}
        onStopRecording={vi.fn()}
        onSelectAudioFile={vi.fn()}
        onPlayRecordedWithScene={vi.fn()}
        onDeleteRecording={vi.fn()}
      />
    );

    const pauseBtn = screen.getByRole('button', { name: /일시정지/i });
    fireEvent.click(pauseBtn);
    expect(onPause).toHaveBeenCalledTimes(1);

    rerender(
      <VoiceRecordBar
        sentenceText="빵 먹어요"
        hasRecordedVoice={false}
        isRecording={true}
        isRecordingPaused={true}
        isPlayingRecordedVoice={false}
        recordError={null}
        onStartRecording={vi.fn()}
        onPauseRecording={onPause}
        onResumeRecording={onResume}
        onStopRecording={vi.fn()}
        onSelectAudioFile={vi.fn()}
        onPlayRecordedWithScene={vi.fn()}
        onDeleteRecording={vi.fn()}
      />
    );

    const resumeBtn = screen.getByRole('button', { name: /이어서 녹음/i });
    fireEvent.click(resumeBtn);
    expect(onResume).toHaveBeenCalledTimes(1);
    expect(pauseAudioRecordingSession(null).ok).toBe(false);
    expect(resumeAudioRecordingSession(null).ok).toBe(false);
  });

  it('[HR-04] Result<T, E> 헬퍼 함수 ok와 err가 정확한 판별 유니온을 반환해야 한다', () => {
    expect(ok('빵 주세요').ok).toBe(true);
    expect(err('TTS_ERROR', '오류').ok).toBe(false);
  });
});
