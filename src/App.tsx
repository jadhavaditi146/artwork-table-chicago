import { useEffect, useState, useRef } from 'react'
import type { Artwork, ApiResponse } from './artTypes'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalRecords, setTotalRecords] = useState<number>(0)

  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const overlayRef = useRef<OverlayPanel>(null)
  const [customCount, setCustomCount] = useState<string>('')

  const rowsPerPage = 12

  const fetchArtworks = async (pageNumber: number) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${pageNumber}`
      )
      const data: ApiResponse = await response.json()
      setArtworks(data.data)
      setTotalRecords(data.pagination.total)
    } catch (error) {
      console.error('Error fetching artworks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArtworks(page)
  }, [page])

  const onPageChange = (event: any) => {
    setPage(event.page + 1)
  }

  const selectedRows = artworks.filter(art => selectedIds.includes(art.id))

  const selectAllCurrentPage = () => {
    const currentPageIds = artworks.map(a => a.id)
    const merged = new Set([...selectedIds, ...currentPageIds])
    setSelectedIds(Array.from(merged))
  }

  const deselectAllCurrentPage = () => {
    const currentPageIds = artworks.map(a => a.id)
    setSelectedIds(selectedIds.filter(id => !currentPageIds.includes(id)))
  }

  const handleCustomSelection = () => {
    const count = parseInt(customCount)
    if (!count || count <= 0) return
    const idsToSelect = artworks.slice(0, Math.min(count, artworks.length)).map(a => a.id)
    const merged = new Set([...selectedIds, ...idsToSelect])
    setSelectedIds(Array.from(merged))
    setCustomCount('')
    overlayRef.current?.hide()
  }

  const totalPages = Math.ceil(totalRecords / rowsPerPage)

  return (
    <div className="app-wrapper">

      {/* ── Header ── */}
      <header className="app-header">
        <div>
          <div className="header-label">Digital Collection</div>
          <h1 className="header-title">Art Institute of Chicago</h1>
        </div>
        <div className="header-meta">
          <div><span>{totalRecords.toLocaleString()}</span> artworks</div>
          <div>Page <span>{page}</span> of <span>{totalPages.toLocaleString()}</span></div>
        </div>
      </header>

      {/* ── Toolbar ── */}
      <div className="toolbar">
        <div className="selection-info">
          <span className={`selection-pill${selectedIds.length === 0 ? ' empty' : ''}`}>
            {selectedIds.length}
          </span>
          {selectedIds.length === 1 ? 'artwork selected' : 'artworks selected'}
        </div>

        <div className="btn-row">
          <Button
            label="Select Page"
            onClick={selectAllCurrentPage}
            className="btn-fill"
          />
          <Button
            label="Deselect Page"
            onClick={deselectAllCurrentPage}
            className="btn-outline"
          />
          <Button
            label="Custom Select"
            onClick={(e) => overlayRef.current?.toggle(e)}
            className="btn-ghost"
          />
        </div>
      </div>

      {/* ── Overlay ── */}
      <OverlayPanel ref={overlayRef}>
        <div className="overlay-inner">
          <div className="overlay-label">Select first N rows</div>
          <InputText
            value={customCount}
            onChange={(e) => setCustomCount(e.target.value)}
            placeholder="e.g. 5"
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSelection()}
          />
          <Button
            label="Apply"
            onClick={handleCustomSelection}
            className="btn-fill"
          />
        </div>
      </OverlayPanel>

      {/* ── Table ── */}
      <DataTable
        value={artworks}
        paginator
        rows={rowsPerPage}
        totalRecords={totalRecords}
        lazy
        loading={loading}
        onPage={onPageChange}
        first={(page - 1) * rowsPerPage}
        dataKey="id"
        selectionMode="checkbox"
        selection={selectedRows}
        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        pageLinkSize={5}
        onSelectionChange={(e: any) => {
          const currentPageSelected: Artwork[] = e.value
          const currentPageIds = artworks.map(a => a.id)
          const kept = selectedIds.filter(id => !currentPageIds.includes(id))
          setSelectedIds([...kept, ...currentPageSelected.map(a => a.id)])
        }}
      >
        <Column selectionMode="multiple" />
        <Column field="title"            header="Title" />
        <Column field="place_of_origin"  header="Origin" />
        <Column field="artist_display"   header="Artist" />
        <Column field="inscriptions"     header="Inscriptions" />
        <Column field="date_start"       header="From" />
        <Column field="date_end"         header="To" />
      </DataTable>

    </div>
  )
}

export default App
