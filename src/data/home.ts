/**
 * HOME MEDIA — contained hero and stage imagery for the homepage, plus product photography.
 * All files are local and include a small blur placeholder for next/image.
 */

export interface MediaImage {
  src: string;
  alt: string;
  /** 20px-wide base64 JPEG used by next/image placeholder="blur" */
  blurDataURL: string;
}

/** Contained hero image. */
export const heroImage: MediaImage = {
  src: "/images/home/slide-opening.jpg",
  alt: "Stacked warehouse cartons in an industrial aisle at first light",
  blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABMNDhEODBMRDxEVFBMXHTAfHRoaHToqLCMwRT1JR0Q9Q0FMVm1dTFFoUkFDX4JgaHF1e3x7SlyGkIV3j214e3b/2wBDARQVFR0ZHTgfHzh2T0NPdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnb/wAARCAAMABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAQFAwb/xAAhEAACAQQCAgMAAAAAAAAAAAABAgMABBESBSExYSJBYv/EABYBAQEBAAAAAAAAAAAAAAAAAAMAAf/EABYRAQEBAAAAAAAAAAAAAAAAAAEAEf/aAAwDAQACEQMRAD8A5GJQxAzrnqm146WS1kmRkKp+xnr1S0WFj3IDEHwfFVI+SuTxcsWyiM/HVVAGKNWQKZFFGyZd0B9mitbW4kji1XGM/YorFdoC/9k=",
};

export interface DayStageMedia {
  image: MediaImage;
}

/** Four image-led stages mirror the four existing `operationalPillars` entries. */
export const dayStageMedia: DayStageMedia[] = [
  {
    image: {
      src: "/images/home/slide-opening.jpg",
      alt: "Stacked warehouse cartons in an industrial aisle",
      blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABMNDhEODBMRDxEVFBMXHTAfHRoaHToqLCMwRT1JR0Q9Q0FMVm1dTFFoUkFDX4JgaHF1e3x7SlyGkIV3j214e3b/2wBDARQVFR0ZHTgfHzh2T0NPdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnb/wAARCAAMABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAQFAwb/xAAhEAACAQQCAgMAAAAAAAAAAAABAgMABBESBSExYSJBYv/EABYBAQEBAAAAAAAAAAAAAAAAAAMAAf/EABYRAQEBAAAAAAAAAAAAAAAAAAEAEf/aAAwDAQACEQMRAD8A5GJQxAzrnqm146WS1kmRkKp+xnr1S0WFj3IDEHwfFVI+SuTxcsWyiM/HVVAGKNWQKZFFGyZd0B9mitbW4kji1XGM/YorFdoC/9k=",
    },
  },
  {
    image: {
      src: "/images/home/product-studio.jpg",
      alt: "Quiet meeting room prepared for a project planning session",
      blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABMNDhEODBMRDxEVFBMXHTAfHRoaHToqLCMwRT1JR0Q9Q0FMVm1dTFFoUkFDX4JgaHF1e3x7SlyGkIV3j214e3b/2wBDARQVFR0ZHTgfHzh2T0NPdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnb/wAARCAAMABQDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUA/8QAJRAAAgEDAwIHAAAAAAAAAAAAAQIDAAQRBRIhIjFBUWFxgdHh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAZEQADAQEBAAAAAAAAAAAAAAAAAQIREhP/2gAMAwEAAhEDEQA/AGxataSqAsnPpn6otzqixTrES4DKW3k9vjFRjeSwqVi2oBxhRih3MrO+9sFvOpYjWU3WIqS6r18SKfdfytUOQkNwfCtT+aB7Z//Z",
    },
  },
  {
    image: {
      src: "/images/home/product-nano.jpg",
      alt: "Charts and figures on a desk during product development",
      blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABMNDhEODBMRDxEVFBMXHTAfHRoaHToqLCMwRT1JR0Q9Q0FMVm1dTFFoUkFDX4JgaHF1e3x7SlyGkIV3j214e3b/2wBDARQVFR0ZHTgfHzh2T0NPdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnb/wAARCAAMABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIEBf/EACYQAAIBAwEHBQAAAAAAAAAAAAECAwAEERIFEyExUXGBIjNBobH/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//EABcRAQEBAQAAAAAAAAAAAAAAAAARASH/2gAMAwEAAhEDEQA/AMK2t55CFtXhlVl9ZyOBz1I/KeW0azjDOFDtxYDmfPSr7dXMeN84X5QBcHxioLq5e2Y7kKoDcuY+6llqvEMsgkfUYtXADI7UU7bQudXuA91FFMY//9k=",
    },
  },
  {
    image: {
      src: "/images/home/slide-close.jpg",
      alt: "Quiet office interior after hours, ready for the next iteration",
      blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABMNDhEODBMRDxEVFBMXHTAfHRoaHToqLCMwRT1JR0Q9Q0FMVm1dTFFoUkFDX4JgaHF1e3x7SlyGkIV3j214e3b/2wBDARQVFR0ZHTgfHzh2T0NPdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnb/wAARCAAMABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAEDBAb/xAAbEAACAwEBAQAAAAAAAAAAAAABAgARMSEDgf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AyIcjGMdMwvp+SQKD5YJXV3WwrEXw0dlQjsILkIH/2Q==",
    },
  },
];

/** 4:3 product photography, keyed by the product slug (existing routes). */
export const productMedia: Record<string, MediaImage> = {
  distributionlife: {
    src: "/images/home/product-distributionlife.jpg",
    alt: "Distribution office desk with an inventory grid and printed ledger",
    blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABMNDhEODBMRDxEVFBMXHTAfHRoaHToqLCMwRT1JR0Q9Q0FMVm1dTFFoUkFDX4JgaHF1e3x7SlyGkIV3j214e3b/2wBDARQVFR0ZHTgfHzh2T0NPdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnb/wAARCAAPABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABAADBf/EACQQAAIBBAECBwAAAAAAAAAAAAECAwAEBREhEhMUQUJRcbHR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgAB/8QAFREBAQAAAAAAAAAAAAAAAAAAABH/2gAMAwEAAhEDEQA/ACZnJQ3fhjFKWKv1cIeOB+Um2xa3dpFLJNMepSdLoAbPPlXPdMfJAs0RnViPQAB8a3QO+8KhY5H0DxpmB+6JNspBDZXhhWNmGgdsdmqhyXMjuSzMx9yd1VRlf//Z",
  },
  nano: {
    src: "/images/home/product-nano.jpg",
    alt: "Charts and figures on a desk",
    blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABMNDhEODBMRDxEVFBMXHTAfHRoaHToqLCMwRT1JR0Q9Q0FMVm1dTFFoUkFDX4JgaHF1e3x7SlyGkIV3j214e3b/2wBDARQVFR0ZHTgfHzh2T0NPdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnb/wAARCAAPABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQGBf/EACQQAAIBAwMDBQAAAAAAAAAAAAECAwARMQQSIQUUIkJhcZGh/8QAFAEBAAAAAAAAAAAAAAAAAAAAA//EABcRAQEBAQAAAAAAAAAAAAAAAAEAEgL/2gAMAwEAAhEDEQA/AEU07a2aLS7poUZTd3T1AYtSes6Vs1vbRvvcJYX8Bf2zmqPu9yjze2cnmldZK0qMu0G45sbH4vQCzvNIzwmCVo3HkM7WBH2KK2T0qFuSZEJyoIIH5RSaI8t//9k=",
  },
  studio: {
    src: "/images/home/product-studio.jpg",
    alt: "Empty meeting room with a long table",
    blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABMNDhEODBMRDxEVFBMXHTAfHRoaHToqLCMwRT1JR0Q9Q0FMVm1dTFFoUkFDX4JgaHF1e3x7SlyGkIV3j214e3b/2wBDARQVFR0ZHTgfHzh2T0NPdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnb/wAARCAAPABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAEDAgX/xAAlEAABAwQBAgcAAAAAAAAAAAABAgMRAAQFIRMxcRIiM0GBkdH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAA//EABgRAQADAQAAAAAAAAAAAAAAAAABAiIR/9oADAMBAAIRAxEAPwDm5PhKXVNoCJUTIMdqdphl3dnzIfVIR4iknv8AlQvGS2lQcJMakAAH461hu74mevlCda3Up7ClVF4K5B9J0yJkCaKTOYueIEqAHsIGh9UU0Zf/2Q==",
  },
};

/**
 * DistributionLife dropdown — item labels and grouping are preserved exactly
 * as specified in the brief. Targets point at existing routes/anchors or the
 * original product endpoints; see DESIGN.md for the swap-out list.
 */
export interface DropdownLink {
  label: string;
  href: string;
  external?: boolean;
}

export const productDropdownMain: DropdownLink[] = [
  { label: "Overview", href: "/distributionlife" },
  { label: "Features", href: "/distributionlife#features" },
  { label: "Pricing", href: "/contact" },
  {
    label: "Download",
    href: "https://www.distributionlife.app/",
    external: true,
  },
  { label: "Contact sales", href: "/contact" },
];

export const productDropdownResources: DropdownLink[] = [
  { label: "User Guide", href: "/journal" },
  { label: "FAQ", href: "/contact#faq" },
];

export const productDropdownLogin: DropdownLink[] = [
  {
    label: "Web app login",
    href: "https://app.distributionlife.app/login",
    external: true,
  },
];
