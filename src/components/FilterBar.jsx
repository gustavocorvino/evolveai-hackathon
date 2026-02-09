import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', label: 'Todos os Casos', icon: '🌌' },
  { id: 'Industria', label: 'Indústria', icon: '🏭' },
  { id: 'Praticas', label: 'Práticas', icon: '⚙️' },
  { id: 'Cases', label: 'Cases', icon: '💼' }
];

const FilterBar = ({ selectedCategory, onCategoryChange, categoryCounts = {}, totalCount = 0 }) => {
  // Se não tiver categoryCounts, usa totalCount para 'all'
  const getCategoryCount = (categoryId) => {
    if (categoryCounts && Object.keys(categoryCounts).length > 0) {
      return categoryCounts[categoryId] || 0;
    }
    return categoryId === 'all' ? totalCount : '-';
  };

  return (
    <div className="mb-8">
      <h2 className="font-display text-2xl font-bold text-neutral-light mb-4">
        🔍 Filtrar por Categoria
      </h2>
      
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          const count = getCategoryCount(category.id);
          
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category.id)}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all duration-300
                flex items-center gap-3
                ${isActive 
                  ? 'bg-gradient-to-r from-neon-cyan to-cosmic-purple text-white shadow-glow-cyan' 
                  : 'bg-neutral-dark/50 border-2 border-neon-cyan/30 text-neutral-light hover:border-neon-cyan'}
              `}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.label}</span>
              <span className={`
                px-2 py-1 rounded-full text-xs font-mono
                ${isActive ? 'bg-white/20' : 'bg-neon-cyan/20 text-neon-cyan'}
              `}>
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
