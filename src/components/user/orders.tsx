import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { Dot } from "lucide-react";
import { Button } from "../ui/button";

type MenuItem = {
  category: string;
  description: string;
  name: string;
  price: string;
  restaurantId: string;
  _id: string;
};

type Order = {
  items: MenuItem[];
  restaurantId: string;
  status: "Pending" | "Approved" | "Cancelled" | "Served";
  userId: string;
  createdAt: Date;
  _id: string;
};

const statusColors = {
  Pending: "yellow-200",
  Approved: "emerald-300",
  Cancelled: "rose-700",
  Served: "cyan-200",
};

const Orders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const user: { userId: string } = jwtDecode(localStorage.getItem("token")!);

  const fetchOrders = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/payment/v1/user/orders`;

      const data = {
        userId: user.userId,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axios.post(url, data, config);

      setOrders(response.data.data);
    } catch (error) {
      toast({
        title: "Something went wrong",
      });
      console.log(error);
    }
  };

  const parseDate = (date: Date) => {
    const newDate = new Date(date);

    return `${newDate.getDay()}-${newDate.getMonth()}-${newDate.getFullYear()} at ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
  };

  return (
    <div className="p-4 flex-1 flex flex-col">
      <div className="pb-4 border-b-2 border-custom-dark-blue flex items-center justify-between">
        <h2 className="text-lg text-custom-blue">Orders</h2>
        <Button size="sm" onClick={fetchOrders}>
          Refresh
        </Button>
      </div>

      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-4">
          {orders.map((order) => (
            <div
              className="p-2 bg-custom-dark-blue rounded-md flex flex-col space-y-1"
              key={order._id}
            >
              <h2 className="font-bold text-custom-black">
                Order ID:- {order._id}
              </h2>
              <p className="text-sm text-custom-blue font-semibold">
                Placed on {parseDate(order.createdAt)}
              </p>
              <div className="bg-custom-blue p-2 rounded-md shadow-sm text-custom-black flex flex-col space-y-1">
                <span className="font-bold">Order summary:</span>
                {order.items.map((item) => (
                  <div className="flex items-center justify-between">
                    <span className="text-custom-dark-blue font-bold">
                      {item.name}
                    </span>
                    <span className="font-semibold">
                      Rs. {item.price} per unit
                    </span>
                  </div>
                ))}
              </div>
              <div
                className={`font-bold text-${
                  statusColors[order.status]
                } flex items-center justify-end`}
              >
                <p>Status: {order.status}</p>
                <Dot className={`bg-${statusColors[order.status]} h-10 w-10`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
