import axios from "axios";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";

type RestaurantData = {
  _id: string;
  name: string;
  description: string;
  location: string;
};

const Restaurants = ({ id }: { id: string }) => {
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);

  useEffect(() => {
    if (id) {
      fetchRestaurants();
    }
  }, [id]);

  const fetchRestaurants = async () => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/restaurant/v1/restaurants`;

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const values = {
        userId: id,
      };

      const response = await axios.post(url, values, config);

      setRestaurants(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);

    toast({
      title: "Copied",
    });
  };

  return (
    <div className="p-4 flex-1">
      <h2 className="pb-4 border-b-2 border-custom-dark-blue text-lg">
        Restaurants
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-4 gap-2">
        {restaurants.length > 0 &&
          restaurants.map((item) => (
            <div
              key={item._id}
              className="w-full bg-custom-dark-blue py-3 px-2 rounded-lg flex flex-col justify-center space-y-2"
            >
              <h3 className="text-lg text-custom-black font-bold">
                {item.name}
              </h3>
              <p className="text-custom-blue">{item.description}</p>
              <p className="text-custom-blue">Location: {item.location}</p>
              <div className="flex items-center justify-between w-full bg-custom-black py-1 px-2 rounded-md text-sm text-custom-blue">
                ID: {item._id}
                <Copy
                  className="h-4 w-4 cursor-pointer hover:text-custom-blue/70"
                  onClick={() => copyToClipboard(item._id)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Restaurants;
