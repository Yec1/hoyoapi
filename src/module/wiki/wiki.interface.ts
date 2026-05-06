export interface IWikiSearchResult {
  id: string
  name: string
  icon: string
  /** Entry page ID to pass to entryPage() */
  entry_page_id: string
}

export interface IWikiEntryPage {
  id: string
  name: string
  desc: string
  icon_url: string
  /** Key-value map of module names to their content */
  modules: IWikiModule[]
}

export interface IWikiModule {
  name: string
  components: IWikiComponent[]
}

export interface IWikiComponent {
  component_id: string
  layout: string
  data: string
}

export interface IWikiEntryListItem {
  entry_page_id: string
  name: string
  icon_url: string
}
