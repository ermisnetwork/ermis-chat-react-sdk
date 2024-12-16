import Card from '@/components/card';

type Props = {
  title: string;
  count: string;
};
export default function CardTotal({ title, count }: Props) {
  return (
    <Card>
      <div className="flex-grow">
        <h6 className="text-sm font-medium">{title}</h6>

        <h3 className="text-2xl font-bold">{count}</h3>
      </div>
    </Card>
  );
}
