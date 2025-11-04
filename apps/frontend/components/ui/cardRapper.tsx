export type CardVariant = "small" | "large";

export interface CardWrapperProps {
  title: string;
  description: string;
  image: string;
  variant: CardVariant;
}

export const CardWrapper = ({
  title,
  description,
  image,
  variant,
}: CardWrapperProps) => {
  const width = variant === "small" ? "w-[400px]" : "w-[700px]";

  return (
    <div
      className={`h-[520px] ${width} shrink-0 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors bg-[url('https://betterstackcdn.com/assets/v2/homepage-v3/carousel-card-bg-83c3fc2b.png')] bg-cover bg-center`}
    >
      <div className="p-4 flex-row justify-between">
        <div className="h-80 bg-slate-950 rounded-lg mb-3 overflow-hidden">
          <img src={image} alt={title} className="w-fit h-fit object-cover" />
        </div>
        <div className="pt-12">
          <h3 className="text-lg font-semibold text-white mb-1.5">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};
