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
 * @typedef Device          {Object}
 * @prop id                 {string}
 * @prop is_active          {boolean}
 * @prop is_private_session {boolean}
 * @prop is_restricted      {boolean}
 * @prop name               {string}
 * @prop type               {string}
 * @prop volume_percent     {number}
 * @prop supports_volume    {boolean}
 */

export {};
