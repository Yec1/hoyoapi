import { LanguageEnum } from '../../language'
import { HTTPRequest } from '../../request'
import {
  IWikiSearchResult,
  IWikiEntryPage,
  IWikiEntryListItem,
} from './wiki.interface'

type WikiGame = 'hsr' | 'zzz'

/**
 * WikiModule provides methods to search and retrieve data from the Hoyolab wiki
 * for Honkai: Star Rail and Zenless Zone Zero.
 *
 * @public
 * @class
 * @category Module
 */
export class WikiModule {
  private readonly searchApi: string
  private readonly entryApi: string
  private readonly entryListApi: string
  private readonly wikiHeaders: Record<string, string>

  /**
   * @param request - HTTPRequest instance (no auth needed for wiki).
   * @param lang - Language for wiki responses.
   * @param game - 'hsr' or 'zzz'.
   */
  constructor(
    _request: HTTPRequest,
    private lang: LanguageEnum,
    game: WikiGame,
  ) {
    const base = `https://sg-wiki-api-static.hoyolab.com/hoyowiki/${game}/wapi`
    this.searchApi = `${base}/search`
    this.entryApi = `${base}/entry_page`
    this.entryListApi = `${base}/get_entry_page_list`
    this.wikiHeaders = {
      'x-rpc-wiki_app': game,
      'x-rpc-language': lang,
      Referer: 'https://wiki.hoyolab.com/',
      Origin: 'https://wiki.hoyolab.com',
    }
  }

  /**
   * Searches the wiki by keyword.
   * Returns the first matching entry page ID, or null if not found.
   *
   * @param keyword - Character/weapon/item name to search for.
   */
  async search(keyword: string): Promise<IWikiSearchResult | null> {
    const url = `${this.searchApi}?keyword=${encodeURIComponent(keyword)}`
    const resp = await fetch(url, { headers: this.wikiHeaders })
    const data = (await resp.json()) as any
    const results = data?.data?.results as IWikiSearchResult[] | undefined
    return results?.[0] ?? null
  }

  /**
   * Retrieves the full entry page for a given entry_page_id.
   *
   * @param entryPageId - The entry_page_id from {@link search}.
   */
  async entryPage(entryPageId: string): Promise<IWikiEntryPage | null> {
    const url = `${this.entryApi}?entry_page_id=${entryPageId}&lang=${this.lang}`
    const resp = await fetch(url, { headers: this.wikiHeaders })
    const data = (await resp.json()) as any
    return (data?.data?.page as IWikiEntryPage) ?? null
  }

  /**
   * Lists entries in a wiki menu category.
   *
   * @param menuId - The menu_id for the category (e.g. characters, weapons).
   * @param pageNum - Page number (1-indexed).
   * @param pageSize - Results per page (max 100).
   */
  async entryList(
    menuId: number,
    pageNum = 1,
    pageSize = 100,
  ): Promise<IWikiEntryListItem[]> {
    const resp = await fetch(this.entryListApi, {
      method: 'POST',
      headers: {
        ...this.wikiHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters: [],
        menu_id: menuId,
        page_num: pageNum,
        page_size: pageSize,
        use_es: true,
      }),
    })
    const data = (await resp.json()) as any
    return (data?.data?.list as IWikiEntryListItem[]) ?? []
  }
}
