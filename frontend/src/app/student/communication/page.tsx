import { StudentCommunicationMain } from '@/app/student/communication/StudentCommunication_components/StudentCommunicationMain';

export const metadata = {
  title: 'Communication | Student Portal',
  description: 'Chat with admin, warden, and roommates',
};

export default function StudentCommunicationPage() {
  return <StudentCommunicationMain />;
}
