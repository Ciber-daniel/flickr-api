export interface Entry {
  title: string;
  link: Link[];
  id: string[];
}

interface Link {
  $: LinkImage;
}

interface LinkImage {
  type: string;
  href: string;
}
