import { readContent } from '@/lib/storage';
import Editor from './Editor';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const content = await readContent();
  return <Editor initial={content} />;
}
