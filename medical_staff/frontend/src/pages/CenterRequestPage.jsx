import Layout from '../components/layout';
import BloodRequestForm from '../components/bloodRequest/blood_request_form';

export default function CenterRequestPage() {
  return (
    <Layout title="Center Request">
      <div>
        <BloodRequestForm />
      </div>
    </Layout>
  );
}