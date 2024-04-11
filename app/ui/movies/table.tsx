import Image from 'next/image';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredMovies } from '@/app/lib/data';

export default async function MoviesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // const movies = await fetchFilteredMovies(query, currentPage);
  const movies = await fetchFilteredMovies(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Table displaying movie details */}
          <table className="min-w-full text-gray-900">
            <thead>
              <tr className="text-left text-sm font-medium">
                <th className="px-3 py-3 sm:pl-6">Id</th>
                <th className="px-3 py-3">Title</th>
                <th className="px-3 py-3">Language</th>

                <th className="px-3 py-3">Release Date</th>
                <th className="px-3 py-3">Popularity</th>
                <th className="px-3 py-3">Vote Average</th>
                <th className="px-4 py-4">Overview</th>
              </tr>
            </thead>
            <tbody>
              {movies?.map((movie) => (
                <tr key={movie.id} className="border-b">
                  <td className="whitespace-nowrap px-3 py-3">{movie.id}</td>
                  <td className="whitespace-nowrap px-3 py-3 ">
                    {movie.title}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {movie.original_language}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(movie.release_date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {movie.popularity}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {movie.vote_average}
                  </td>
                  <td className="whitespace-wrap px-4 py-4">
                    {movie.overview}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
