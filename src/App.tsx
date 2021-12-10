import { useCallback, useEffect, useMemo, useState } from 'react';

import { SideBar } from './components/SideBar';
import { Content } from './components/Content';

import { api } from './services/api';

import './styles/global.scss';

import './styles/sidebar.scss';
import './styles/content.scss';

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>(
    {} as GenreResponseProps
  );

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  const memoizedHandleClickButton = useCallback(
    (id: number) => handleClickButton(id),
    []
  );

  const memoizedSidebar = useMemo(
    () => (
      <SideBar
        genres={genres}
        selectedGenreId={selectedGenreId}
        buttonClickCallback={memoizedHandleClickButton}
      />
    ),
    [genres, selectedGenreId, memoizedHandleClickButton]
  );

  const memoizedContent = useMemo(
    () => <Content selectedGenre={selectedGenre} movies={movies} />,
    [selectedGenre, movies]
  );

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then((response) => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`)
      .then((response) => {
        setMovies(response.data);
      });

    const newSelectedGenre =
      genres.find((genre) => genre.id === selectedGenreId) || selectedGenre;

    setSelectedGenre(newSelectedGenre);
  }, [selectedGenreId, genres]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {memoizedSidebar}

      {memoizedContent}
    </div>
  );
}
