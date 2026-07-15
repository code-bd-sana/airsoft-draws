'use client';

import { useEffect, useState } from 'react';
import { Category, categoryService } from '../../../../services/category.service';

const AVAILABLE_ICONS = ['Crosshair', 'Target', 'Shield', 'Gun', 'Ammo', 'Helmet', 'Star'];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentCategory({ name: '', slug: '', icon: '', image: '', isActive: true });
    setImageFile(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setImageFile(null);
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!currentCategory.name) {
      setError('Name is required');
      return;
    }

    try {
      let finalImageUrl = currentCategory.image;

      if (imageFile) {
        try {
          const res = await categoryService.uploadImage(imageFile);
          finalImageUrl = res.url;
        } catch (uploadErr: any) {
          setError(uploadErr?.response?.data?.message || 'Failed to upload image');
          return;
        }
      }

      const payload = { ...currentCategory, image: finalImageUrl };

      if (isEditMode && currentCategory.id) {
        await categoryService.updateCategory(currentCategory.id, payload);
      } else {
        await categoryService.createCategory(payload);
      }
      closeModal();
      fetchCategories();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save category');
    }
  };

  const toggleStatus = async (category: Category) => {
    try {
      await categoryService.updateCategory(category.id, { isActive: !category.isActive });
      fetchCategories();
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error('Failed to delete category', err);
        alert('Failed to delete category. It might be in use.');
      }
    }
  };

  return (
    <div className='flex flex-col gap-8 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='font-heading font-bold text-[32px] text-[#E8EDD4] tracking-[-0.02em]'>
            Categories Management
          </h1>
          <p className='font-sans text-[14px] text-[#72943A] mt-1'>
            Manage public categories displayed on the homepage.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className='bg-primary hover:bg-[#ff4d79] text-[#0D0D0B] px-5 py-2.5 rounded-[8px] font-heading font-bold text-[14px] transition-colors flex items-center gap-2'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
          </svg>
          Add Category
        </button>
      </div>

      <div className='w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] overflow-hidden overflow-x-auto'>
        <table className='w-full min-w-[900px] text-left border-collapse'>
          <thead>
            <tr className='border-b border-[#2D3C13] bg-[#111210]'>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] w-[60px]'>
                Image
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]'>
                Name
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]'>
                Slug
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]'>
                Icon
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]'>
                Status
              </th>
              <th className='py-4 px-6 font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px] text-right'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className='py-8 text-center text-[#72943A]'>
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={6} className='py-8 text-center text-[#72943A]'>
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category, i) => (
                <tr
                  key={category.id}
                  className={`${i !== categories.length - 1 ? 'border-b border-[#2D3C13]' : ''} hover:bg-[#1A230A] transition-colors`}
                >
                  <td className='py-4 px-6'>
                    {category.image ? (
                      <div className='w-[40px] h-[40px] rounded-[6px] overflow-hidden border border-[#2D3C13]'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={category.image}
                          alt={category.name}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    ) : (
                      <div className='w-[40px] h-[40px] rounded-[6px] bg-[#0D0D0B] border border-[#2D3C13] flex items-center justify-center'>
                        <svg
                          className='w-4 h-4 text-[#5A752A]'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                          />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className='py-4 px-6'>
                    <span className='font-sans font-medium text-[14px] text-[#E8EDD4]'>
                      {category.name}
                    </span>
                  </td>
                  <td className='py-4 px-6'>
                    <span className='font-sans text-[13px] text-[#72943A]'>{category.slug}</span>
                  </td>
                  <td className='py-4 px-6'>
                    <span className='font-sans text-[13px] text-[#72943A]'>
                      {category.icon || '-'}
                    </span>
                  </td>
                  <td className='py-4 px-6'>
                    <button
                      onClick={() => toggleStatus(category)}
                      className={`px-3 py-1 inline-flex text-[10px] leading-5 font-sans font-medium rounded-full border ${
                        category.isActive
                          ? 'border-[#4ADE80]/30 bg-[#083b18] text-[#4ADE80]'
                          : 'border-[#EF4444]/30 bg-[#7F1D1D] text-[#f76b6b]'
                      }`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className='py-4 px-6 text-right'>
                    <div className='flex items-center justify-end gap-4'>
                      <button
                        onClick={() => openEditModal(category)}
                        className='text-[#5A752A] hover:text-[#E8EDD4] transition-colors'
                        title='Edit'
                      >
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className='text-[#f76b6b] hover:text-[#ef4444] transition-colors'
                        title='Delete'
                      >
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div
            className='fixed inset-0 z-50 bg-[#0D0D0B]/80 backdrop-blur-sm transition-opacity'
            onClick={closeModal}
          />
          <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] bg-[#161810] border border-[#2D3C13] rounded-[16px] shadow-2xl z-50 animate-fadeIn flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between p-6 border-b border-[#2D3C13] bg-[#111210] sticky top-0 z-10'>
              <h2 className='font-heading font-bold text-[20px] text-[#E8EDD4]'>
                {isEditMode ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={closeModal}
                className='text-[#5A752A] hover:text-[#E8EDD4] transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='p-6 space-y-5'>
              {error && (
                <div className='p-3 bg-[#7F1D1D]/20 border border-[#EF4444]/30 text-[#f76b6b] text-sm rounded-[8px] font-sans'>
                  {error}
                </div>
              )}

              <div>
                <label className='block text-[13px] font-sans text-[#72943A] mb-1.5'>Name *</label>
                <input
                  type='text'
                  value={currentCategory.name || ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                  className='w-full h-[44px] px-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] focus:outline-none focus:border-[#8CB34A] text-[#E8EDD4] font-sans text-[14px] placeholder:text-[#5A752A] transition-colors'
                  placeholder='e.g. Rifles'
                />
              </div>

              <div>
                <label className='block text-[13px] font-sans text-[#72943A] mb-1.5'>
                  Slug (Optional)
                </label>
                <input
                  type='text'
                  value={currentCategory.slug || ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                  className='w-full h-[44px] px-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] focus:outline-none focus:border-[#8CB34A] text-[#E8EDD4] font-sans text-[14px] placeholder:text-[#5A752A] transition-colors'
                  placeholder='e.g. rifles'
                />
              </div>

              <div>
                <label className='block text-[13px] font-sans text-[#72943A] mb-1.5'>
                  Icon Selection (Optional)
                </label>
                <div className='relative'>
                  <select
                    value={currentCategory.icon || ''}
                    onChange={(e) =>
                      setCurrentCategory({ ...currentCategory, icon: e.target.value })
                    }
                    className='w-full h-[44px] px-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] focus:outline-none focus:border-[#8CB34A] text-[#E8EDD4] font-sans text-[14px] transition-colors appearance-none cursor-pointer'
                  >
                    <option value=''>Select an icon...</option>
                    {AVAILABLE_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#5A752A]'>
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Image Upload Area */}
              <div>
                <label className='block text-[13px] font-sans text-[#72943A] mb-1.5'>
                  Category Image (Optional)
                </label>
                <div
                  onClick={() =>
                    !currentCategory.image && !imageFile
                      ? document.getElementById('categoryImageInput')?.click()
                      : undefined
                  }
                  className={`w-full h-[140px] border-2 border-dashed rounded-[8px] flex flex-col items-center justify-center transition-colors relative overflow-hidden group ${
                    currentCategory.image || imageFile
                      ? 'border-[#2D3C13] bg-[#0D0D0B]'
                      : 'border-[#2D3C13] hover:border-[#8CB34A] hover:bg-[#1A230A]/50 cursor-pointer bg-[#0D0D0B]'
                  }`}
                >
                  {currentCategory.image || imageFile ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageFile ? URL.createObjectURL(imageFile) : currentCategory.image!}
                        alt='Preview'
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                            setCurrentCategory({ ...currentCategory, image: undefined });
                            const el = document.getElementById(
                              'categoryImageInput',
                            ) as HTMLInputElement;
                            if (el) el.value = '';
                          }}
                          className='h-[32px] px-[12px] bg-[#f76b6b] text-white font-sans font-medium text-[12px] rounded-[6px] hover:bg-[#ef4444] transition-colors'
                        >
                          Remove Image
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <svg
                        className='w-6 h-6 text-[#8CB34A] mb-2'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z'
                        />
                      </svg>
                      <span className='font-sans font-medium text-[12px] text-[#E8EDD4]'>
                        Click to upload image
                      </span>
                    </>
                  )}
                  <input
                    id='categoryImageInput'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setCurrentCategory({
                          ...currentCategory,
                          image: URL.createObjectURL(file),
                        });
                      }
                    }}
                  />
                </div>
              </div>

              <div className='flex items-center mt-2'>
                <input
                  type='checkbox'
                  id='isActive'
                  checked={currentCategory.isActive !== false}
                  onChange={(e) =>
                    setCurrentCategory({ ...currentCategory, isActive: e.target.checked })
                  }
                  className='h-4 w-4 rounded border-[#2D3C13] bg-[#0D0D0B] text-primary focus:ring-primary focus:ring-offset-[#161810]'
                />
                <label
                  htmlFor='isActive'
                  className='ml-2 block text-[13px] font-sans text-[#E8EDD4]'
                >
                  Active (visible to public)
                </label>
              </div>
            </div>

            <div className='p-6 border-t border-[#2D3C13] bg-[#111210] flex justify-end gap-3 sticky bottom-0 z-10'>
              <button
                onClick={closeModal}
                className='px-5 py-2.5 rounded-[8px] bg-transparent border border-[#2D3C13] hover:border-[#5A752A] text-[#E8EDD4] font-heading font-bold text-[14px] transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className='px-5 py-2.5 bg-primary hover:bg-[#ff4d79] text-[#0D0D0B] rounded-[8px] font-heading font-bold text-[14px] transition-colors'
              >
                Save Category
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
