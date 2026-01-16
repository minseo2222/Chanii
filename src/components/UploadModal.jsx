import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

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
        if (prefillData) {
            setFormData(prev => ({
                ...prev,
                title: prefillData.title || '',
                description: prefillData.description || '',
                ingredients: prefillData.ingredients || '',
                category: prefillData.category || '한식'
            }));
            // If prefill has an image (e.g. from recipe), you might want to show it or leave empty for user upload
            // For verification, we usually want the USER'S photo, so we might start empty or show recipe image as placeholder
            // But let's leave it empty to encourage upload, or use prefill if provided
            if (prefillData.image) {
                // Optional context: setPreviewUrl(prefillData.image); 
                // But user wants to upload their OWN photo.
            }
            setSetProfile(false);
        }
    }, [prefillData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use previewUrl as the image source (Data URL)
        // If no new image uploaded but prefill had one, use that? 
        // Or if it's verification, we mandate an image or use default?
        // Let's pass previewUrl. If null, parent decides.
        onUpload?.({
            ...formData,
            image: previewUrl || (prefillData?.image), // Fallback to prefill if no new upload
            setProfile: prefillData ? setProfile : false
        });
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-pastel-purple to-pastel-blue bg-clip-text text-transparent">
                            {prefillData ? '요리 인증샷 올리기' : '레시피 업로드'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Image Upload Area */}
                        <div
                            onClick={triggerFileInput}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer relative overflow-hidden group ${previewUrl ? 'border-pastel-purple bg-purple-50' : 'border-gray-300 hover:border-pastel-purple'
                                }`}
                        >
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileChange}
                            />

                            {previewUrl ? (
                                <div className="relative h-64 w-full">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white font-bold flex items-center gap-2">
                                            <Upload size={20} /> 사진 변경하기
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8">
                                    <Upload className="mx-auto mb-2 text-gray-400" size={40} />
                                    <p className="text-sm text-gray-600">
                                        {prefillData ? '완성된 요리 사진을 올려주세요!' : '사진 또는 영상을 업로드하세요'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        클릭하여 파일 선택
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Set Recipe Profile Option (Only if image exists) */}
                        {prefillData && (previewUrl || prefillData.image) && (
                            <div className="flex items-center gap-2 px-1">
                                <input
                                    type="checkbox"
                                    id="setProfile"
                                    checked={setProfile}
                                    onChange={e => setSetProfile(e.target.checked)}
                                    className="w-5 h-5 text-pastel-purple rounded border-gray-300 focus:ring-pastel-purple accent-pastel-purple"
                                />
                                <label htmlFor="setProfile" className="text-sm font-medium text-gray-700">
                                    이 사진을 요리 대표 사진으로 설정
                                </label>
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                제목
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pastel-purple focus:outline-none transition-colors"
                                placeholder="제목을 입력하세요"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                설명
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pastel-purple focus:outline-none transition-colors resize-none"
                                rows="3"
                                placeholder={prefillData ? '맛은 어땠나요? 팁이 있다면 공유해주세요!' : '레시피에 대해 간단히 설명해주세요'}
                                required
                            />
                        </div>

                        {/* Ingredients */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                재료 (쉼표로 구분)
                            </label>
                            <input
                                type="text"
                                value={formData.ingredients}
                                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pastel-purple focus:outline-none transition-colors"
                                placeholder="예: 밥, 김치, 식용유, 대파"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                카테고리
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pastel-purple focus:outline-none transition-colors"
                            >
                                <option value="한식">한식</option>
                                <option value="양식">양식</option>
                                <option value="중식">중식</option>
                                <option value="일식">일식</option>
                                <option value="베이킹">베이킹</option>
                                <option value="디저트">디저트</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            className="w-full btn-primary mt-6"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {prefillData ? '인증샷 올리기' : '업로드하기'}
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UploadModal;
