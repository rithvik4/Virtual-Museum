import type { SearchFilters } from '@/types/museum';

type GalleryFiltersProps = {
  filters: SearchFilters;
  periods: string[];
  countries: string[];
  collections: string[];
  rooms: Array<{ id: string; name: string }>;
  onChange: (filters: SearchFilters) => void;
};

export function GalleryFilters({ filters, periods, countries, collections, rooms, onChange }: GalleryFiltersProps) {
  const selectClassName = 'rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none';

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <input
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
        placeholder="Search artwork, artist, style"
        className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 xl:col-span-2"
      />
      <select value={filters.period} onChange={(event) => onChange({ ...filters, period: event.target.value })} className={selectClassName}>
        <option value="all">All periods</option>
        {periods.map((period) => (
          <option key={period} value={period}>{period}</option>
        ))}
      </select>
      <select value={filters.country} onChange={(event) => onChange({ ...filters, country: event.target.value })} className={selectClassName}>
        <option value="all">All countries</option>
        {countries.map((country) => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>
      <select value={filters.collection} onChange={(event) => onChange({ ...filters, collection: event.target.value })} className={selectClassName}>
        <option value="all">All collections</option>
        {collections.map((collection) => (
          <option key={collection} value={collection}>{collection}</option>
        ))}
      </select>
      <select value={filters.roomId} onChange={(event) => onChange({ ...filters, roomId: event.target.value })} className={selectClassName}>
        <option value="all">All rooms</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>{room.name}</option>
        ))}
      </select>
    </div>
  );
}