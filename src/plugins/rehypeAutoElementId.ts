import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Node } from 'unist';
import { Element } from 'hast';

// プラグインのタイプを定義
export const rehypeAutoElementId: Plugin = () => {
  return (tree: Node) => {
    let idCounter = 0;

    visit(tree, 'element', (node: Element) => {
      // ユニークIDを生成（ここでは単純なカウンターを使用）
      const uniqueId = `unique-id-${idCounter++}`;
      // 'id'プロパティがない場合のみIDを追加
      if (!node.properties) node.properties = {};
      if (!node.properties.id) {
        node.properties.id = uniqueId;
      }
    });
  };
};
