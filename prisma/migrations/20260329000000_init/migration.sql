-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "iconEmoji" TEXT NOT NULL DEFAULT '📦',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "storeUrl" TEXT,
    "referralUrl" TEXT NOT NULL,
    "referralCode" TEXT,
    "categoryId" TEXT NOT NULL,
    "descriptionShort" TEXT NOT NULL,
    "descriptionLong" TEXT,
    "creditType" TEXT,
    "creditValueUser" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "creditValueOperator" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageEmoji" TEXT NOT NULL DEFAULT '🔗',
    "imageUrl" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateModified" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "notes" TEXT,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Click" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrerUrl" TEXT,
    "userAgent" TEXT,
    "ipHash" TEXT,
    "country" TEXT,
    "deviceType" TEXT,
    "sourcePage" TEXT,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkCheck" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusCode" INTEGER,
    "responseTimeMs" INTEGER,
    "redirectChain" TEXT,
    "errorMessage" TEXT,
    "isHealthy" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "LinkCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "blogTitle" TEXT NOT NULL DEFAULT 'ReferralHub',
    "tagline" TEXT NOT NULL DEFAULT 'Hand-picked deals from products I personally use',
    "aboutContent" TEXT NOT NULL DEFAULT '',
    "ftcDisclosure" TEXT NOT NULL DEFAULT 'This site contains referral links. When you use these links, I may earn a commission or credit at no additional cost to you. I only recommend products and services I personally use.',
    "operatorName" TEXT NOT NULL DEFAULT 'Admin',
    "operatorEmail" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateUniqueIndex
CREATE UNIQUE INDEX "Deal_slug_key" ON "Deal"("slug");

-- CreateIndex
CREATE INDEX "Deal_categoryId_idx" ON "Deal"("categoryId");

-- CreateIndex
CREATE INDEX "Deal_status_idx" ON "Deal"("status");

-- CreateIndex
CREATE INDEX "Deal_featured_status_idx" ON "Deal"("featured", "status");

-- CreateIndex
CREATE INDEX "Click_dealId_idx" ON "Click"("dealId");

-- CreateIndex
CREATE INDEX "Click_clickedAt_idx" ON "Click"("clickedAt");

-- CreateIndex
CREATE INDEX "LinkCheck_dealId_idx" ON "LinkCheck"("dealId");

-- CreateUniqueIndex
CREATE UNIQUE INDEX "Newsletter_email_key" ON "Newsletter"("email");

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkCheck" ADD CONSTRAINT "LinkCheck_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
