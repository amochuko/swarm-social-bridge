type FeedProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: Record<string, any>[];
};
export function Feed(props: FeedProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        maxWidth: 480,
        gap: 8,
        margin: '0 auto',

      }}
    >
      <h3>Feed</h3>
      {props.posts.map((p) => (
        <div key={p.bzzHash}>
          <small>{p.bzzHash.slice(0, 10)}...</small>
          <p>{p.content}</p>
        </div>
      ))}
    </div>
  );
}
