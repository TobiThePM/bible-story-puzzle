import type { Metadata } from 'next';
import Link from 'next/link';
import { STORIES } from '@/content/stories';

export const metadata: Metadata = {
  title: 'Story Library | Bible Story Puzzle',
  description: 'All twenty stories, from Genesis to Jeremiah, with references and verses.',
};

/**
 * A teaching resource in its own right - usable without playing the game.
 * Rendered as static HTML at build time, so it works with JavaScript off.
 */
export default function LibraryPage() {
  return (
    <main className="page">
      <div className="shell">
        <div className="pagehead">
          <h1>Story Library</h1>
          <p>
            All twenty stories, in the order they appear in the Bible &mdash; from the first
            morning of creation to a potter&rsquo;s wheel in Jerusalem.
          </p>
          <div className="home__foot">
            <Link className="btn btn--ghost" href="/">
              &larr; Back
            </Link>
          </div>
        </div>

        <div className="library">
          {STORIES.map((story) => (
            <article className="entry" key={story.id}>
              <div
                className="entry__img"
                style={{ backgroundImage: `url(${story.image})` }}
                role="img"
                aria-label={story.alt}
              />
              <div>
                <p className="entry__num">Story {story.order} of {STORIES.length}</p>
                <h2 className="entry__title">{story.title}</h2>
                <p className="entry__ref">{story.reference}</p>
                <p className="entry__text">{story.retelling}</p>
                <blockquote className="entry__verse">
                  &ldquo;{story.verse}&rdquo;
                  <br />
                  <cite style={{ fontSize: '0.78rem', color: 'var(--ink-faint)', fontStyle: 'normal' }}>
                    {story.verseReference}
                  </cite>
                </blockquote>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
