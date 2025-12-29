import { notFound } from 'next/navigation';
import { getEquipmentBySlug, getRelatedEquipment } from './actions';
import { EquipmentDetail } from './components/EquipmentDetail';
import { EquipmentGallery } from './components/EquipmentGallery';
import { EquipmentSpecs } from './components/EquipmentSpecs';
import { EquipmentBooking } from './components/EquipmentBooking';
import { RelatedEquipment } from './components/RelatedEquipment';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const EquipmentPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const equipment = await getEquipmentBySlug(slug);
  if (!equipment) notFound();
  const relatedEquipment = await getRelatedEquipment(
    equipment.category.slug,
    equipment.id
  );
  return (
    <div className="container py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/equipamentos">Equipamentos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/equipamentos?categoria=${equipment.category.slug}`}
            >
              {equipment.category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{equipment.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <EquipmentGallery
            images={equipment.images}
            mainImage={equipment.mainImageUrl}
            name={equipment.name}
          />
          <EquipmentDetail equipment={equipment} />
          <Separator />
          <EquipmentSpecs specs={equipment.specs} equipment={equipment} />
        </div>
        <div>
          <EquipmentBooking equipment={equipment} />
        </div>
      </div>
      {relatedEquipment.length > 0 && (
        <>
          <Separator className="my-12" />
          <RelatedEquipment equipment={relatedEquipment} />
        </>
      )}
    </div>
  );
};

export default EquipmentPage;
