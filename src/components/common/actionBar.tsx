export default function ActionBar({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-center">{children}</div>
    </>
  );
}
