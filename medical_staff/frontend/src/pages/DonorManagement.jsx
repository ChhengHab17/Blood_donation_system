import Layout from '../components/layout';
import Donorlist from '../components/DonorManagement/Donorlist';

export default function BloodInventory() {
  return (
    <Layout title="Blood Inventory">
      <Donorlist />
    </Layout>
  );
}