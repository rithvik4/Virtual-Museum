import type { SearchFilters } from '@/types/museum';
import { MuseumSelect } from '@/common/MuseumSelect';

type GalleryFiltersProps = {
  filters: SearchFilters;
  periods: string[];
  countries: string[];
  collections: string[];
  rooms: Array<{ id: string; name: string }>;
  onChange: (filters: SearchFilters) => void;
};

export function GalleryFilters({ filters, periods, countries, collections, rooms, onChange }: GalleryFiltersProps) {
  const selectClassName = 'rounded-full border border-white/10 bg-white/5 text-sm text-white';

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <input
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
        placeholder="Search Indian artwork, artist, style"
        className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 xl:col-span-2"
      />
      <MuseumSelect
        value={filters.period}
        onChange={(period) => onChange({ ...filters, period })}
        className={selectClassName}
        options={[
          { value: 'all', label: 'All Indian periods' },
          ...periods.map((period) => ({ value: period, label: period })),
        ]}
      />
      <MuseumSelect
        value={filters.country}
        onChange={(country) => onChange({ ...filters, country })}
        className={selectClassName}
        options={[
          { value: 'all', label: 'All regions' },
          ...countries.map((country) => ({ value: country, label: country })),
        ]}
      />
      <MuseumSelect
        value={filters.collection}
        onChange={(collection) => onChange({ ...filters, collection })}
        className={selectClassName}
        options={[
          { value: 'all', label: 'All collections' },
          ...collections.map((collection) => ({ value: collection, label: collection })),
        ]}
      />
      <MuseumSelect
        value={filters.roomId}
        onChange={(roomId) => onChange({ ...filters, roomId })}
        className={selectClassName}
        options={[
          { value: 'all', label: 'All rooms' },
          ...rooms.map((room) => ({ value: room.id, label: room.name })),
        ]}
      />
    </div>
  );
}