import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Briefcase, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TitleDropdownProps {
  titles: string[];
  selectedTitle: string;
  onSelectTitle: (title: string) => void;
  titleCounts?: Record<string, number>;
}

export function TitleDropdown({
  titles,
  selectedTitle,
  onSelectTitle,
  titleCounts = {},
}: TitleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredTitles = useMemo(() => {
    if (!searchQuery.trim()) return titles;
    const q = searchQuery.toLowerCase().trim();
    return titles.filter((t) => t.toLowerCase().includes(q));
  }, [titles, searchQuery]);

  const isCustomSelected = selectedTitle !== 'all';
  const totalCount = useMemo(() => {
    return Object.values(titleCounts).reduce((acc, c) => acc + c, 0);
  }, [titleCounts]);

  return (
    <div className="relative w-full" ref={dropdownRef} id="title-dropdown-container">
      {/* Trigger Button */}
      <button
        type="button"
        id="title-dropdown-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border text-right transition-all duration-200 cursor-pointer ${
          isCustomSelected
            ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-semibold shadow-xs ring-2 ring-indigo-500/15'
            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isCustomSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="flex flex-col items-start truncate text-right">
            <span className="text-[11px] font-medium text-slate-400">التخصص / المسمى الوظيفي</span>
            <span className="text-sm font-semibold truncate">
              {isCustomSelected ? selectedTitle : 'جميع التخصصات الوظيفية'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isCustomSelected && (
            <button
              type="button"
              title="إلغاء التصفية"
              onClick={(e) => {
                e.stopPropagation();
                onSelectTitle('all');
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {isCustomSelected && titleCounts[selectedTitle] !== undefined && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white">
              {titleCounts[selectedTitle]}
            </span>
          )}

          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 right-0 left-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden backdrop-blur-md"
            role="listbox"
          >
            {/* Search Input inside Dropdown */}
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/70">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="ابحث عن تخصص أو مسمى..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-8 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List options */}
            <div className="max-h-64 overflow-y-auto p-1.5 scrollbar-thin">
              {/* Option: All */}
              {!searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectTitle('all');
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-right ${
                    selectedTitle === 'all'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  role="option"
                  aria-selected={selectedTitle === 'all'}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        selectedTitle === 'all'
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedTitle === 'all' && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span>جميع التخصصات / المسميات</span>
                  </div>
                  {totalCount > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-mono">
                      {totalCount}
                    </span>
                  )}
                </button>
              )}

              {filteredTitles.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  لا توجد تخصصات مطابقة للبحث
                </div>
              ) : (
                filteredTitles.map((title) => {
                  const isSelected = selectedTitle === title;
                  const count = titleCounts[title];

                  return (
                    <button
                      key={title}
                      type="button"
                      onClick={() => {
                        onSelectTitle(title);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-right my-0.5 ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="truncate">{title}</span>
                      </div>

                      {count !== undefined && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-mono shrink-0 mr-2 ${
                            isSelected
                              ? 'bg-indigo-200/70 text-indigo-900 font-bold'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer info in dropdown */}
            <div className="px-3 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>{titles.length} تخصص متاح</span>
              {isCustomSelected && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectTitle('all');
                    setIsOpen(false);
                  }}
                  className="text-indigo-600 hover:underline font-semibold"
                >
                  إلغاء التحديد
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
