'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const HeaderSearch = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/equipamentos?search=${encodeURIComponent(search.trim())}`);
      setOpen(false);
      setSearch('');
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <VisuallyHidden>
          <DialogTitle>Buscar equipamentos</DialogTitle>
        </VisuallyHidden>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Buscar escavadeiras, tratores, guindastes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
            autoFocus
          />
          <Button type="submit">Buscar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { HeaderSearch };
