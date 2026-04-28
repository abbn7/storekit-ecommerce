import { eq, and, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { storeConfig, banners, announcements, testimonials } from "@/lib/db/schema";

export async function getStoreConfig() {
  const [config] = await db.select().from(storeConfig).limit(1);
  return config ?? null;
}

export async function updateStoreConfig(data: Partial<typeof storeConfig.$inferInsert>) {
  const existing = await getStoreConfig();
  if (!existing) {
    const [config] = await db.insert(storeConfig).values(data as typeof storeConfig.$inferInsert).returning();
    return config;
  }
  const [config] = await db
    .update(storeConfig)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(storeConfig.id, existing.id))
    .returning();
  return config;
}

export async function getBanners(position?: string) {
  const conditions = position
    ? eq(banners.position, position)
    : undefined;

  return db
    .select()
    .from(banners)
    .where(conditions)
    .orderBy(asc(banners.sortOrder));
}

export async function getActiveBanners(position?: string) {
  const conditions = [eq(banners.isActive, true)];
  if (position) conditions.push(eq(banners.position, position));

  return db
    .select()
    .from(banners)
    .where(and(...conditions))
    .orderBy(asc(banners.sortOrder));
}

export async function getBannerById(id: string) {
  const [banner] = await db.select().from(banners).where(eq(banners.id, id)).limit(1);
  return banner ?? null;
}

export async function createBanner(data: typeof banners.$inferInsert) {
  const [banner] = await db.insert(banners).values(data).returning();
  return banner;
}

export async function updateBanner(id: string, data: Partial<typeof banners.$inferInsert>) {
  const [banner] = await db.update(banners).set(data).where(eq(banners.id, id)).returning();
  return banner;
}

export async function deleteBanner(id: string) {
  await db.delete(banners).where(eq(banners.id, id));
}

export async function getAnnouncements() {
  return db.select().from(announcements).orderBy(asc(announcements.sortOrder));
}

export async function getActiveAnnouncements() {
  return db
    .select()
    .from(announcements)
    .where(eq(announcements.isActive, true))
    .orderBy(asc(announcements.sortOrder));
}

export async function getAnnouncementById(id: string) {
  const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
  return announcement ?? null;
}

export async function createAnnouncement(data: typeof announcements.$inferInsert) {
  const [announcement] = await db.insert(announcements).values(data).returning();
  return announcement;
}

export async function updateAnnouncement(id: string, data: Partial<typeof announcements.$inferInsert>) {
  const [announcement] = await db.update(announcements).set(data).where(eq(announcements.id, id)).returning();
  return announcement;
}

export async function deleteAnnouncement(id: string) {
  await db.delete(announcements).where(eq(announcements.id, id));
}

export async function getTestimonials() {
  return db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
}

export async function getActiveTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isActive, true))
    .orderBy(asc(testimonials.sortOrder));
}

export async function getTestimonialById(id: string) {
  const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return testimonial ?? null;
}

export async function createTestimonial(data: typeof testimonials.$inferInsert) {
  const [testimonial] = await db.insert(testimonials).values(data).returning();
  return testimonial;
}

export async function updateTestimonial(id: string, data: Partial<typeof testimonials.$inferInsert>) {
  const [testimonial] = await db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning();
  return testimonial;
}

export async function deleteTestimonial(id: string) {
  await db.delete(testimonials).where(eq(testimonials.id, id));
}
