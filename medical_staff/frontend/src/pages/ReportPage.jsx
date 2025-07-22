import StatsCards from "../components/report/stateCard"
import DonorTable from "../components/report/donorTable"
import InventoryTable from "../components/report/inventoryTable"
import Layout from '../components/layout';

export default function ReportPage() {
  return (
    <Layout title="Report">
      <div className="space-y-6">
        <StatsCards />
        <DonorTable />
        <InventoryTable />
      </div>
    </Layout>
  )
}
