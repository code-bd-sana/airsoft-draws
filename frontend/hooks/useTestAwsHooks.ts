import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { testAwsService } from '../services/test-aws.service';
import { toast } from 'sonner';

export const useCreateTestAwMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => testAwsService.createTestAw(formData),
    onSuccess: (data) => {
      toast.success('Files uploaded and caught successfully by TestAwsController!');
      queryClient.invalidateQueries({ queryKey: ['test-aws'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to upload files to TestAwsController';
      toast.error(message);
    },
  });
};

export const useGetTestAwsQuery = () => {
  return useQuery({
    queryKey: ['test-aws'],
    queryFn: () => testAwsService.getTestAws(),
  });
};
