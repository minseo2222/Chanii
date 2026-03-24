export const storageMeta = {
  refrigerated: {
    id: 'refrigerated',
    label: '냉장',
    fullLabel: '냉장 보관',
    icon: '🧊',
    accentClass: 'bg-sky-50 text-sky-700 border-sky-100',
    softClass: 'bg-sky-50',
    emptyTitle: '냉장 칸이 비어 있어요',
    emptyDescription: '자주 쓰는 재료를 먼저 등록하면 오늘 요리 추천이 더 정확해져요.',
    helperText: '신선 식재료와 바로 쓸 재료를 보관해요.'
  },
  frozen: {
    id: 'frozen',
    label: '냉동',
    fullLabel: '냉동 보관',
    icon: '❄️',
    accentClass: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    softClass: 'bg-cyan-50',
    emptyTitle: '냉동 칸이 비어 있어요',
    emptyDescription: '미리 얼려 둔 재료를 등록해 두면 재고 낭비를 줄이기 쉬워져요.',
    helperText: '장기 보관용 재료와 쟁여 둔 재료를 관리해요.'
  },
  room: {
    id: 'room',
    label: '실온',
    fullLabel: '실온 보관',
    icon: '🥫',
    accentClass: 'bg-amber-50 text-amber-700 border-amber-100',
    softClass: 'bg-amber-50',
    emptyTitle: '실온 보관 재료가 없어요',
    emptyDescription: '통조림, 소스, 라면처럼 자주 쓰는 기본 재료를 추가해 보세요.',
    helperText: '팬트리와 조미료처럼 실온에 두는 재료를 정리해요.'
  }
};

export const storageTabs = Object.values(storageMeta);

export const processingOptions = ['생재료', '반찬', '반가공', '가공식품'];

export const processingMeta = {
  생재료: {
    label: '생재료',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  반찬: {
    label: '반찬',
    className: 'bg-violet-50 text-violet-700 border-violet-100'
  },
  반가공: {
    label: '반가공',
    className: 'bg-pink-50 text-pink-700 border-pink-100'
  },
  가공식품: {
    label: '가공식품',
    className: 'bg-slate-100 text-slate-700 border-slate-200'
  }
};

export const getStorageLabel = (location) => storageMeta[location]?.label || '미분류';

export const getProcessingLabel = (processingState) =>
  processingMeta[processingState]?.label || processingState || '미분류';

export const formatFreshnessStatus = (freshness) => {
  if (!freshness) return '상태 확인 필요';
  if (freshness.status === 'expired') return '유통기한 지남';
  if (freshness.status === 'danger') return '곧 만료';
  if (freshness.status === 'warning') return '주의';
  return '여유 있음';
};

export const formatFreshnessCountdown = (freshness) => {
  if (!freshness) return '날짜 확인 필요';
  if (freshness.days <= 0) return '기한 만료';
  if (freshness.days === 1) return '내일 만료';
  return `${freshness.days}일 남음`;
};
