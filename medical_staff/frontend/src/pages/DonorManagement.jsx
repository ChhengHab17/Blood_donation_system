import Layout from '../components/layout';
import Donorlist from '../components/DonorManagement/Donorlist';

export default function DonorManagementPage() {
  return (
    <Layout title="Donor Management">
      <Donorlist />
    </Layout>
  );
}