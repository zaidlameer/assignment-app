import CustomerList from "../components/CustomerList";

export default function Dashboard() {
  return (
    <div className="p-4">
      {/* Customer List */}
      <CustomerList />
      {/* Room to add additional metrics etc */}
    </div>
    

  );
}
