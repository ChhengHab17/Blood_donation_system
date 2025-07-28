import Layout from '../components/layout';
import BloodRequestForm from '../components/bloodRequest/blood_request_form';

export default function BloodRequestPage() {
  return (
    <Layout title="Request For Blood">
      <div>
        <BloodRequestForm />
      </div>
    </Layout>
  );
} 