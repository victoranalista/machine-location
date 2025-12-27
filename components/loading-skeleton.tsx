import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingSkeleton = () => (
  <div className="space-y-3 w-full">
    {[1, 2, 3].map((i) => (
      <Card key={i}>
        <CardContent className="p-3 md:p-4">
          <Skeleton className="h-5 md:h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    ))}
  </div>
);
