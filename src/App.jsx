import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import RecipeExplorer from './pages/RecipeExplorer';
import Community from './pages/Community';
import BottomNav from './components/BottomNav';
import UploadModal from './components/UploadModal';
import { mockInventory } from './data/mockInventory';

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [inventory, setInventory] = useState(mockInventory);
    const [userStats, setUserStats] = useState({
        level: 1,
        xp: 35,
        maxXp: 100,
        coins: 150,
        profileImage: null
    });

    // Global Modal State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadPrefill, setUploadPrefill] = useState(null);

    // Cooking History
    const [cookingHistory, setCookingHistory] = useState([]);

    // Recipe Image Overrides (User's Recipe Profiles)
    const [recipeOverrides, setRecipeOverrides] = useState({});

    // Recipe Navigation State (for "Go to Recipe" from history)
    const [initialRecipeId, setInitialRecipeId] = useState(null);

    // Handle navigation
    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    // Handle Deep Link to Recipe
    const handleViewRecipe = (recipeId) => {
        setInitialRecipeId(recipeId);
        setCurrentPage('recipes');
    };

    const handleClearInitialRecipe = () => {
        setInitialRecipeId(null);
    };

    // Handle adding new ingredient
    const handleAddIngredient = (newIngredient) => {
        setInventory(prev => [...prev, newIngredient]);
    };

    // Handle toggling between refrigerated and frozen
    const handleToggleFreeze = (ingredientId) => {
        setInventory(prev => prev.map(item => {
            if (item.id === ingredientId && item.location !== 'room') {
                return {
                    ...item,
                    location: item.location === 'refrigerated' ? 'frozen' : 'refrigerated'
                };
            }
            return item;
        }));
    };

    // Handle updating ingredient
    const handleUpdateIngredient = (ingredientId, updates) => {
        setInventory(prev => prev.map(item =>
            item.id === ingredientId ? { ...item, ...updates } : item
        ));
    };

    // Handle deleting ingredient
    const handleDeleteIngredient = (ingredientId) => {
        setInventory(prev => prev.filter(item => item.id !== ingredientId));
    };

    // Set Recipe Profile Image
    const handleSetRecipeImage = (recipeId, imageUrl) => {
        setRecipeOverrides(prev => ({
            ...prev,
            [recipeId]: imageUrl
        }));
    };

    // Handle Upload Logic
    const handleOpenUpload = (prefill = null) => {
        setUploadPrefill(prefill);
        setShowUploadModal(true);
    };

    const handleUpload = (data) => {
        console.log("Uploaded:", data);
        alert('업로드 완료! 🎉');

        // If it was a completion verification, add to history
        if (uploadPrefill) {
            // Use the image returned from the modal (uploaded one) or fallback to prefill
            const finalImage = data.image || uploadPrefill.image;

            setCookingHistory(prev => [{
                ...data,
                id: Date.now(),
                thumbnail: finalImage,
                date: new Date().toLocaleDateString(),
                recipeId: uploadPrefill.recipeId
            }, ...prev]);

            // Give rewards
            setUserStats(prev => ({
                ...prev,
                xp: Math.min(prev.xp + 20, prev.maxXp),
                coins: prev.coins + 30
            }));

            // Set Recipe Main Image if requested
            if (data.setProfile && finalImage && uploadPrefill.recipeId) {
                handleSetRecipeImage(uploadPrefill.recipeId, finalImage);
                alert(`'${data.title}' 사진이 해당 요리의 대표 사진으로 설정되었습니다! 🖼️`);
            }
        }

        setShowUploadModal(false);
        setUploadPrefill(null);
    };

    // Page transition variants
    const pageVariants = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    return (
        <div className="app">
            <AnimatePresence mode="wait">
                {currentPage === 'dashboard' && (
                    <motion.div
                        key="dashboard"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                    >
                        <Dashboard
                            userStats={userStats}
                            inventory={inventory}
                            cookingHistory={cookingHistory}
                            onNavigate={handleNavigate}
                            onViewRecipe={handleViewRecipe}
                            onSetRecipeImage={handleSetRecipeImage}
                            recipeOverrides={recipeOverrides}
                        />
                    </motion.div>
                )}

                {currentPage === 'inventory' && (
                    <motion.div
                        key="inventory"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                    >
                        <Inventory
                            inventory={inventory}
                            onAddIngredient={handleAddIngredient}
                            onUpdateIngredient={handleUpdateIngredient}
                            onDeleteIngredient={handleDeleteIngredient}
                            onToggleFreeze={handleToggleFreeze}
                            onNavigate={handleNavigate}
                        />
                    </motion.div>
                )}

                {currentPage === 'recipes' && (
                    <motion.div
                        key="recipes"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                    >
                        <RecipeExplorer
                            inventory={inventory}
                            onOpenUpload={handleOpenUpload}
                            cookingHistory={cookingHistory}
                            initialRecipeId={initialRecipeId}
                            onClearInitialRecipe={handleClearInitialRecipe}
                            recipeOverrides={recipeOverrides}
                        />
                    </motion.div>
                )}

                {currentPage === 'community' && (
                    <motion.div
                        key="community"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                    >
                        <Community
                            inventory={inventory}
                            onOpenUpload={handleOpenUpload}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation */}
            <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />

            {/* Global Upload Modal */}
            {showUploadModal && (
                <UploadModal
                    prefillData={uploadPrefill}
                    onClose={() => {
                        setShowUploadModal(false);
                        setUploadPrefill(null);
                    }}
                    onUpload={handleUpload}
                />
            )}
        </div>
    );
}

export default App;
