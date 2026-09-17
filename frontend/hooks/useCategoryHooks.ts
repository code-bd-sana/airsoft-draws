import { useQuery } from '@tanstack/react-query';
import { categoryService, Category } from '../services/category.service';

export const usePublicCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['publicCategories'],
    queryFn: () => categoryService.getPublicCategories(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['allCategories'],
    queryFn: () => categoryService.getAllCategories(),
  });
};
