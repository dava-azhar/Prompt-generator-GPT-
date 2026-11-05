import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useToastState } from './hooks/useToast';
import { useCommands } from './hooks/useCommands';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FAB } from './components/FAB';
import { Toast } from './components/Toast';
import { CommandDetailModal } from './components/CommandDetailModal';
import { CommandEditorModal } from './components/CommandEditorModal';
import { AiGeneratorModal } from './components/AiGeneratorModal';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { GeneratePage } from './pages/GeneratePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';

import { ActiveTab, SlashCommand } from './types/command';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const { toasts, showToast, removeToast } = useToastState();
  const { currentUser, signIn, signOut } = useAuth();

  const {
    allCommands,
    filteredCommands,
    favoriteCommands,
    recentCommands,
    customCommands,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    toggleFavorite,
    copyCommand,
    saveCustomCommand,
    deleteCustomCommand,
    importCommands,
  } = useCommands(currentUser, showToast);

  // Modals state
  const [selectedCommand, setSelectedCommand] = useState<SlashCommand | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCommand, setEditingCommand] = useState<SlashCommand | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleOpenEdit = (cmd: SlashCommand) => {
    setEditingCommand(cmd);
    setIsEditorOpen(true);
  };

  const handleOpenNewCommand = () => {
    setEditingCommand(null);
    setIsEditorOpen(true);
  };

  const handleAiCommandGenerated = (cmd: SlashCommand) => {
    saveCustomCommand(cmd);
    setSelectedCommand(cmd);
  };

  const handleCategorySelectFromHome = (slug: string) => {
    setSelectedCategory(slug);
    setActiveTab('explore');
  };

  return (
    <div className="min-h-screen bg-[#080D19] text-[#F8FAFC] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Toast Alert System */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Global Mobile Header */}
      <Header
        currentUser={currentUser}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenAiGenerator={() => setIsAiModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-4 pb-20">
        {activeTab === 'home' && (
          <HomePage
            allCommands={allCommands}
            favoriteCommands={favoriteCommands}
            recentCommands={recentCommands}
            customCommands={customCommands}
            onSelectCommand={setSelectedCommand}
            onCopyCommand={copyCommand}
            onToggleFavorite={toggleFavorite}
            onNavigateTab={setActiveTab}
            onSelectCategory={handleCategorySelectFromHome}
            onOpenAiGenerator={() => setIsAiModalOpen(true)}
          />
        )}

        {activeTab === 'explore' && (
          <ExplorePage
            filteredCommands={filteredCommands}
            allCommands={allCommands}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onSelectCommand={setSelectedCommand}
            onCopyCommand={copyCommand}
            onToggleFavorite={toggleFavorite}
            onEditCommand={handleOpenEdit}
            onDeleteCommand={deleteCustomCommand}
          />
        )}

        {activeTab === 'generate' && (
          <GeneratePage
            onSaveCommand={saveCustomCommand}
            onCopyCommand={copyCommand}
            onOpenAiGenerator={() => setIsAiModalOpen(true)}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesPage
            favoriteCommands={favoriteCommands}
            onSelectCommand={setSelectedCommand}
            onCopyCommand={copyCommand}
            onToggleFavorite={toggleFavorite}
            onNavigateExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            onSignIn={signIn}
            onSignOut={signOut}
            customCommands={customCommands}
            allCommands={allCommands}
            favoriteCount={favoriteCommands.length}
            onEditCommand={handleOpenEdit}
            onDeleteCommand={deleteCustomCommand}
            onSelectCommand={setSelectedCommand}
            onImportCommands={importCommands}
            showToast={showToast}
          />
        )}
      </main>

      {/* Floating Action Button (FAB) for instant command creation */}
      {activeTab !== 'generate' && (
        <FAB onClick={handleOpenNewCommand} label="Command Baru" />
      )}

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        favoritesCount={favoriteCommands.length}
      />

      {/* Command Detail Inspection Modal */}
      <CommandDetailModal
        command={selectedCommand}
        onClose={() => setSelectedCommand(null)}
        onCopy={copyCommand}
        onToggleFavorite={toggleFavorite}
        onEdit={selectedCommand?.userId !== 'system' ? handleOpenEdit : undefined}
        isCustom={selectedCommand?.userId !== 'system'}
      />

      {/* Interactive Command Editor Modal */}
      <CommandEditorModal
        isOpen={isEditorOpen}
        initialCommand={editingCommand}
        onClose={() => setIsEditorOpen(false)}
        onSave={saveCustomCommand}
      />

      {/* Natural Language AI Prompt Generator Modal */}
      <AiGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onCommandGenerated={handleAiCommandGenerated}
      />

    </div>
  );
}
