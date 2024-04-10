import Search from '@/app/ui/search';
import { MoviesTableSkeleton } from '@/app/ui/skeletons';
import MoviesTable from '@/app/ui/movies/table';
import { Suspense } from 'react';
import { fetchMoviesPages } from '@/app/lib/data';
import Pagination from '@/app/ui/movies/pagination';

export default async function MoviesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchMoviesPages(query);

  const handlePageChange = (page: number) => {};

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Movies</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search movies..." />
      </div>
      <Suspense key={query + currentPage} fallback={<MoviesTableSkeleton />}>
        <MoviesTable query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination
          totalPages={totalPages}
          //   initialPage={currentPage}
          //   onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
