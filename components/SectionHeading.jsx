export default function SectionHeading({ heading, accent }) {
  return (
    <h2 className="section-h">
      {heading}
      {accent && <em> {accent}</em>}
    </h2>
  );
}
