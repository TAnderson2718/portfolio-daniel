import './admin.css';

export const metadata = {
  title: 'Admin · daniel-portfolio',
  robots: 'noindex,nofollow',
};

export default function AdminLayout({ children }) {
  return <div className="admin-root">{children}</div>;
}
