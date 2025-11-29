import Card from "../../components/Card";
import products from "../data/products.json";

export const metadata = { title: "Products | Amor + Chai" };

const ProductsPage = () => {
	return (
		<section className="mx-auto max-w-7xl px-4 pb-20 pt-6">
			<h1 className="mb-10 text-center text-3xl font-extrabold text-gray-800">
				Featured Products
			</h1>
			<div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
				{products.map((product) => (
					<Card key={product.id} product={product} />
				))}
			</div>
		</section>
	);
};

export default ProductsPage;


