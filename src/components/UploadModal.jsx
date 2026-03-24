import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';

const categories = ['한식', '간편식', '퓨전', '야식', '이색'];

const UploadModal = ({ onClose, prefillData, onUpload }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    category: '한식'
  });
  const [setProfile, setSetProfile] = useState(false);

  useEffect(() => {
    if (!prefillData) return;

    setFormData((prev) => ({
      ...prev,
      title: prefillData.title || '',
      description: prefillData.description || '',
      ingredients: prefillData.ingredients || '',
      category: prefillData.category || '한식'
    }));
    setSetProfile(false);
  }, [prefillData]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onUpload?.({
      ...formData,
      image: previewUrl || prefillData?.image,
      setProfile: prefillData ? setProfile : false,
      consumption: prefillData?.consumption || [],
      purchases: prefillData?.purchases || []
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 20 }}
          className="modal-content w-full max-w-xl p-6"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">{prefillData ? 'Cooking Journal' : 'Community Upload'}</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{prefillData ? '요리 기록 올리기' : '레시피 업로드'}</h2>
              <p className="mt-2 text-sm text-slate-500">사진과 한 줄 설명만 넣어도 공유 흐름이 자연스럽게 이어져요.</p>
            </div>
            <button type="button" onClick={onClose} className="btn-secondary flex h-11 w-11 items-center justify-center px-0">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed p-8 text-center transition-colors ${
                previewUrl || prefillData?.image ? 'border-slate-300 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-400'
              }`}
            >
              <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileChange} />

              {previewUrl || prefillData?.image ? (
                <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-100">
                  <img src={previewUrl || prefillData?.image} alt="Preview" className="h-full w-full object-contain" loading="lazy" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity hover:opacity-100">
                    <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                      <Upload size={16} />
                      사진 변경하기
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="mb-3 text-slate-400" size={40} />
                  <p className="font-semibold text-slate-700">
                    {prefillData ? '완성한 요리 사진을 올려 주세요' : '사진 또는 이미지를 업로드해 보세요'}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">클릭해서 파일을 선택할 수 있어요.</p>
                </>
              )}
            </button>

            {prefillData && (previewUrl || prefillData.image) ? (
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={setProfile}
                  onChange={(event) => setSetProfile(event.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 accent-slate-900"
                />
                이 사진을 해당 레시피 대표 사진으로 지정
              </label>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="upload-title">
                제목
              </label>
              <input
                id="upload-title"
                type="text"
                value={formData.title}
                onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                className="input-shell"
                placeholder="제목을 입력해 주세요"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="upload-description">
                설명
              </label>
              <textarea
                id="upload-description"
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                className="input-shell min-h-[112px] resize-none"
                placeholder={
                  prefillData
                    ? '맛, 팁, 실패 방지 포인트가 있다면 짧게 남겨 주세요.'
                    : '레시피에 대한 간단한 소개를 적어 주세요.'
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="upload-ingredients">
                재료
              </label>
              <input
                id="upload-ingredients"
                type="text"
                value={formData.ingredients}
                onChange={(event) => setFormData((prev) => ({ ...prev, ingredients: event.target.value }))}
                className="input-shell"
                placeholder="예: 밥, 김치, 참치"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="upload-category">
                카테고리
              </label>
              <select
                id="upload-category"
                value={formData.category}
                onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                className="input-shell"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <motion.button type="submit" className="btn-primary mt-2 w-full" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              {prefillData ? '기록 올리기' : '업로드하기'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;
