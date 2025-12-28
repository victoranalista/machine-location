'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const handleClose = () => {
    setOpen(false);
    setSearch('');
  };
  if (!open) {
    return (
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Search className="h-5 w-5" />
      </Button>
    );
  }
  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200"
    >
      <Input
        type="text"
        placeholder="Buscar equipamentos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9 w-48 sm:w-64"
        autoFocus
      />
      <Button type="submit" size="sm">
        <Search className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
        <X className="h-4 w-4" />
      </Button>
    </form>
  );
};

export { HeaderSearch };
