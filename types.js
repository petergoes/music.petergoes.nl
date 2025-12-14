/**
 * @typedef {() => string} Component
 */

/**
 * @template Props
 * @typedef {(props: Props) => string} ComponentWithProps
 */

/**
 * @typedef {(slot: string | Record<string, string>) => string} ComponentWithSlot
 */

/**
 * @template Props
 * @typedef {(slot: string | Record<string, string>, props: Props) => string} ComponentWithPropsAndSlot
 */

/**
 * @typedef Image {Object}
 * @prop [height] {number}
 * @prop [width]  {number}
 * @prop url      {string}
 */

/**
 * @typedef Artist {object}
 * @prop albums    {Album['id'][]}
 * @prop href      {string}
 * @prop id        {string}
 * @prop [images]  {Image[]}
 * @prop name      {string}
 * @prop uri       {string}
 */

/**
 * @typedef Track     {object}
 * @prop artists      {Artist['id'][]}
 * @prop disk_number  {number}
 * @prop duration_ms  {number}
 * @prop href         {string}
 * @prop id           {string}
 * @prop name         {string}
 * @prop track_number {number}
 * @prop uri          {string}
 */

/**
 * @typedef Album     {Object}
 * @prop added_at     {number}
 * @prop artists      {Artist['id'][]}
 * @prop href         {string}
 * @prop id           {string}
 * @prop images       {Image[]}
 * @prop label        {string}
 * @prop name         {string}
 * @prop release_date {number}
 * @prop total_tracks {number}
 * @prop tracks       {Track['id'][]}
 * @prop uri          {string}
 */

/**
 * @typedef {Record<string, Album[]>} ArtistAlbumMap
 */

/**
 * @typedef Device           {Object}
 * @prop id                  {string}
 * @prop is_active           {boolean}
 * @prop is_private_session  {boolean}
 * @prop is_restricted       {boolean}
 * @prop is_local_web_player {boolean}
 * @prop name                {string}
 * @prop type                {string}
 * @prop volume_percent      {number}
 * @prop supports_volume     {boolean}
 */

/**
 * @typedef ContextPlayback {Object}
 * @prop type          {'artist' | 'playlist' | 'album' | 'show'}
 * @prop href          {string} - A link to the Web API endpoint providing full details of the track.
 * @prop external_urls {string[]} - External URLs for this context.
 * @prop uri           {string}
 */

/**
 * @typedef PlaybackActions        {Object}
 * @prop [interrupting_playback]   {boolean}
 * @prop [pausing]                 {boolean}
 * @prop [resuming]                {boolean}
 * @prop [seeking]                 {boolean}
 * @prop [skipping_next]           {boolean}
 * @prop [skipping_prev]           {boolean}
 * @prop [toggling_repeat_context] {boolean}
 * @prop [toggling_shuffle]        {boolean}
 * @prop [toggling_repeat_track]   {boolean}
 * @prop [transferring_playback]   {boolean}
 */

/**
 * @typedef PlaybackState       {Object}
 * @prop device                 {Device}
 * @prop repeat_state           {'off' | 'track' | 'context'}
 * @prop shuffle_state          {Boolean}
 * @prop context                {ContextPlayback | null}
 * @prop timestamp              {number} - Unix Millisecond Timestamp when playback state was last changed (play, pause, skip, scrub, new song, etc.).
 * @prop progress_ms            {number | null} - Progress into the currently playing track or episode.
 * @prop is_playing             {boolean}
 * @prop item                   {Track}
 * @prop currently_playing_type {'track' | 'episode' | 'ad' | 'unknown'}
 * @prop actions                {PlaybackActions}
 */

export {};
