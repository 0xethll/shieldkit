'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  NodeTypes,
  Handle,
  Position,
} from '@xyflow/react'
import { Lock, Unlock, RefreshCw } from 'lucide-react'

// Custom Node Component
interface CustomNodeData {
  label: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  iconColor?: string
  borderColor: string
  bgColor: string
}

function CustomNode({ data }: { data: CustomNodeData }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-6 py-4 rounded-xl border-2 ${data.borderColor} ${data.bgColor} shadow-lg min-w-[200px]`}
    >
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
      <Handle type="target" position={Position.Left} className="!bg-gray-400" />
      <Handle type="source" position={Position.Right} className="!bg-gray-400" />

      <div className="flex items-center gap-3 mb-2">
        {data.icon && <data.icon className={`h-5 w-5 ${data.iconColor}`} />}
        <div className="font-bold text-sm">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {data.description}
        </div>
      )}
    </motion.div>
  )
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

export function FlowDiagram() {
  const [activeFlow, setActiveFlow] = useState<'wrap' | 'transfer' | 'unwrap'>(
    'wrap'
  )

  // Unwrap Flow - Simplified with only participants
  const unwrapNodes: Node[] = [
    {
      id: 'unwrap-client',
      type: 'custom',
      position: { x: 50, y: 80 },
      data: {
        label: 'Client',
        description: 'User Wallet',
        icon: Unlock,
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        borderColor: 'border-blue-500',
      },
    },
    {
      id: 'unwrap-contract',
      type: 'custom',
      position: { x: 500, y: 360 },
      data: {
        label: 'ERC7984 Contract',
        description: 'Smart Contract',
        icon: Lock,
        iconColor: 'text-purple-500',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        borderColor: 'border-purple-500',
      },
    },
    {
      id: 'unwrap-indexer',
      type: 'custom',
      position: { x: 950, y: 80 },
      data: {
        label: 'External Index Service',
        description: 'Envio Indexer',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        borderColor: 'border-green-500',
      },
    },
    {
      id: 'unwrap-complete',
      type: 'custom',
      position: { x: 500, y: 600 },
      data: {
        label: '✓ Complete',
        description: 'Public tokens received',
        icon: Unlock,
        iconColor: 'text-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        borderColor: 'border-emerald-500',
      },
    },
  ]

  const unwrapEdges: Edge[] = [
    {
      id: 'unwrap-e1',
      source: 'unwrap-client',
      target: 'unwrap-contract',
      label: '① unwrap(from, to, amount, proof)',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#3b82f6', strokeWidth: 3 },
    },
    {
      id: 'unwrap-e2',
      source: 'unwrap-contract',
      target: 'unwrap-indexer',
      label: '② emit UnwrapRequested(to, burntAmount)',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#10b981', strokeWidth: 3, strokeDasharray: '8 4' },
    },
    {
      id: 'unwrap-e3',
      source: 'unwrap-client',
      target: 'unwrap-indexer',
      label: '③ query pending requests',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#06b6d4', strokeWidth: 3 },
    },
    {
      id: 'unwrap-e4',
      source: 'unwrap-indexer',
      target: 'unwrap-client',
      label: '④ return pending requests',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#06b6d4', strokeWidth: 3, strokeDasharray: '5 5' },
    },
    {
      id: 'unwrap-e5',
      source: 'unwrap-client',
      target: 'unwrap-contract',
      label: '⑤ finalizeUnwrap(decryptedAmount)',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#10b981', strokeWidth: 3 },
    },
    {
      id: 'unwrap-v1',
      source: 'unwrap-contract',
      target: 'unwrap-complete',
      animated: false,
      style: { stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '5 5' },
    },
  ]

  // Wrap Flow - Simplified with only participants
  const wrapNodes: Node[] = [
    {
      id: 'wrap-client',
      type: 'custom',
      position: { x: 50, y: 80 },
      data: {
        label: 'Client',
        description: 'Token Holder',
        icon: Unlock,
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        borderColor: 'border-blue-500',
      },
    },
    {
      id: 'wrap-erc20',
      type: 'custom',
      position: { x: 500, y: 360 },
      data: {
        label: 'ERC20 Token',
        description: 'Public Token',
        bgColor: 'bg-gray-50 dark:bg-gray-950/30',
        borderColor: 'border-gray-500',
      },
    },
    {
      id: 'wrap-contract',
      type: 'custom',
      position: { x: 950, y: 80 },
      data: {
        label: 'ERC7984 Contract',
        description: 'Confidential Token',
        icon: Lock,
        iconColor: 'text-purple-500',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        borderColor: 'border-purple-500',
      },
    },
    {
      id: 'wrap-complete',
      type: 'custom',
      position: { x: 50, y: 500 },
      data: {
        label: '✓ Complete',
        description: 'Encrypted balance received',
        icon: Lock,
        iconColor: 'text-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        borderColor: 'border-emerald-500',
      },
    },
  ]

  const wrapEdges: Edge[] = [
    {
      id: 'wrap-e1',
      source: 'wrap-client',
      target: 'wrap-erc20',
      label: '① approve(ERC7984, amount)',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#3b82f6', strokeWidth: 3 },
    },
    {
      id: 'wrap-e2',
      source: 'wrap-client',
      target: 'wrap-contract',
      label: '② wrap(amount)',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#3b82f6', strokeWidth: 3 },
    },
    {
      id: 'wrap-e3',
      source: 'wrap-contract',
      target: 'wrap-erc20',
      label: '③ transferFrom(client, this, amount)',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#a855f7', strokeWidth: 3 },
    },
    {
      id: 'wrap-e4',
      source: 'wrap-contract',
      target: 'wrap-client',
      label: '④ _mint(client, encryptedAmount)',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#10b981', strokeWidth: 3 },
    },
    {
      id: 'wrap-v1',
      source: 'wrap-client',
      target: 'wrap-complete',
      animated: false,
      style: { stroke: '#93c5fd', strokeWidth: 2, strokeDasharray: '5 5' },
    },
  ]

  // Transfer Flow - Simplified with only participants
  const transferNodes: Node[] = [
    {
      id: 'transfer-sender',
      type: 'custom',
      position: { x: 50, y: 80 },
      data: {
        label: 'Sender',
        description: 'Has encrypted balance',
        icon: Lock,
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        borderColor: 'border-blue-500',
      },
    },
    {
      id: 'transfer-contract',
      type: 'custom',
      position: { x: 500, y: 80 },
      data: {
        label: 'ERC7984 Contract',
        description: 'FHE Operations',
        icon: Lock,
        iconColor: 'text-purple-500',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        borderColor: 'border-purple-500',
      },
    },
    {
      id: 'transfer-receiver',
      type: 'custom',
      position: { x: 950, y: 80 },
      data: {
        label: 'Receiver',
        description: 'Destination address',
        icon: Lock,
        iconColor: 'text-green-500',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        borderColor: 'border-green-500',
      },
    },
    {
      id: 'transfer-complete',
      type: 'custom',
      position: { x: 500, y: 500 },
      data: {
        label: '✓ Complete',
        description: 'Balances updated (encrypted)',
        icon: Lock,
        iconColor: 'text-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        borderColor: 'border-emerald-500',
      },
    },
  ]

  const transferEdges: Edge[] = [
    {
      id: 'transfer-e1',
      source: 'transfer-sender',
      target: 'transfer-contract',
      label: '① transfer(to, encryptedAmount, proof)',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#3b82f6', strokeWidth: 3 },
    },
    {
      id: 'transfer-e2',
      source: 'transfer-contract',
      target: 'transfer-sender',
      label: '② FHE.sub(sender.balance, amount)',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#ef4444', strokeWidth: 3 },
    },
    {
      id: 'transfer-e3',
      source: 'transfer-contract',
      target: 'transfer-receiver',
      label: '③ FHE.add(receiver.balance, amount)',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#10b981', strokeWidth: 3 },
    },
    {
      id: 'transfer-v1',
      source: 'transfer-contract',
      target: 'transfer-complete',
      animated: false,
      style: { stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '5 5' },
    },
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState(wrapNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(wrapEdges)

  useEffect(() => {
    if (activeFlow === 'wrap') {
      setNodes(wrapNodes)
      setEdges(wrapEdges)
    } else if (activeFlow === 'transfer') {
      setNodes(transferNodes)
      setEdges(transferEdges)
    } else {
      setNodes(unwrapNodes)
      setEdges(unwrapEdges)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFlow])


  return (
    <section className="py-20 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Interactive sequence diagrams showing complete token lifecycle
          </p>

          {/* Flow Selector */}
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { id: 'wrap', label: 'Wrap Flow', icon: Lock },
              { id: 'transfer', label: 'Transfer Flow', icon: RefreshCw },
              { id: 'unwrap', label: 'Unwrap Flow', icon: Unlock },
            ].map((flow) => (
              <motion.button
                key={flow.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setActiveFlow(flow.id as 'unwrap' | 'wrap' | 'transfer')
                }
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  activeFlow === flow.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <flow.icon className="h-5 w-5" />
                {flow.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ReactFlow Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 rounded-2xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl"
          style={{ height: '800px' }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
            elementsSelectable={true}
            nodesConnectable={false}
            nodesDraggable={true}
            zoomOnScroll={true}
            panOnScroll={false}
            defaultEdgeOptions={{
              animated: true,
            }}
          >
            <Background
              color="#93c5fd"
              gap={16}
              size={1}
              className="dark:opacity-20"
            />
            <Controls className="!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700" />
          </ReactFlow>
        </motion.div>

        {/* Flow Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <h3 className="font-bold text-lg mb-3">
            {activeFlow === 'wrap' && '🔒 Wrap Process (ERC20 → Confidential Token)'}
            {activeFlow === 'transfer' && '↔️ Transfer Process (Private Transfer with FHE)'}
            {activeFlow === 'unwrap' && '🔓 Unwrap Process (Two-Phase with Public Decryption)'}
          </h3>
          {activeFlow === 'wrap' && (
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p className="text-base">
                The wrap process converts public ERC20 tokens into confidential tokens with <span className="font-semibold text-blue-600 dark:text-blue-400">encrypted balances</span>.
              </p>

              <div className="space-y-2">
                <p className="font-semibold text-blue-600 dark:text-blue-400">Steps:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-xs">
                  <li>Client approves ERC7984 contract to spend <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded text-xs">ERC20 tokens</code></li>
                  <li>Client calls <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded text-xs">wrap(amount)</code></li>
                  <li>Contract calls <code className="bg-purple-100 dark:bg-purple-900 px-1 rounded text-xs">transferFrom()</code> to get ERC20 tokens</li>
                  <li>Contract mints <code className="bg-green-100 dark:bg-green-900 px-1 rounded text-xs">encrypted balance</code> to client</li>
                </ol>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  <span>Result: Public tokens become private tokens</span>
                </div>
              </div>
            </div>
          )}
          {activeFlow === 'transfer' && (
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p className="text-base">
                Private transfers use <span className="font-semibold text-purple-600 dark:text-purple-400">Fully Homomorphic Encryption (FHE)</span> to compute on encrypted data without decryption.
              </p>

              <div className="space-y-2">
                <p className="font-semibold text-purple-600 dark:text-purple-400">Steps:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-xs">
                  <li>Sender creates <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded text-xs">encrypted input + proof</code></li>
                  <li>Sender calls <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded text-xs">transfer(to, encryptedAmount, proof)</code></li>
                  <li>Contract <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded text-xs">verifies input proof</code></li>
                  <li>Contract performs <code className="bg-red-100 dark:bg-red-900 px-1 rounded text-xs">FHE.sub()</code> on sender&apos;s encrypted balance</li>
                  <li>Contract performs <code className="bg-green-100 dark:bg-green-900 px-1 rounded text-xs">FHE.add()</code> on receiver&apos;s encrypted balance</li>
                </ol>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-purple-200 dark:border-purple-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔐</span>
                  <span>Transfer amount remains encrypted throughout</span>
                </div>
              </div>
            </div>
          )}
          {activeFlow === 'unwrap' && (
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p className="text-base">
                The sequence diagram above shows the complete two-phase unwrap process with <span className="font-semibold text-blue-600 dark:text-blue-400">animated data flows</span>. Watch the arrows to see how data moves between participants!
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <p className="font-semibold text-orange-600 dark:text-orange-400">Phase 1: Burn 🔥</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2 text-xs">
                    <li>Client calls <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded text-xs">unwrap()</code></li>
                    <li>Contract executes <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded text-xs">_burn()</code></li>
                    <li>Contract emits <code className="bg-green-100 dark:bg-green-900 px-1 rounded text-xs">UnwrapRequested</code> event</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">Phase 2: Finalize ✅</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2 text-xs" start={4}>
                    <li>Client queries indexer for pending requests</li>
                    <li>Client runs <code className="bg-pink-100 dark:bg-pink-900 px-1 rounded text-xs">publicDecrypt()</code></li>
                    <li>Client calls <code className="bg-emerald-100 dark:bg-emerald-900 px-1 rounded text-xs">finalizeUnwrap()</code></li>
                  </ol>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-blue-500"></div>
                  <span>Solid = Request</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-cyan-500 border-t-2 border-dashed"></div>
                  <span>Dashed = Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  <span>Animated flows show data movement</span>
                </div>
              </div>
            </div>
          )}
          {activeFlow === 'wrap' && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              The wrap process converts public ERC20 tokens into confidential tokens. Users approve the contract to spend their tokens, then the contract mints an equivalent encrypted amount, giving users private balances.
            </p>
          )}
          {activeFlow === 'transfer' && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Private transfers happen entirely on encrypted data using Fully Homomorphic Encryption. The contract performs encrypted arithmetic operations (subtract from sender, add to receiver) without ever revealing the amounts.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
