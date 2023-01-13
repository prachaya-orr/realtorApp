-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_home_id_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;
