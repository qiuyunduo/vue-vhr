<template>
  <div id="list">
  	<ul style="padding-left:0;margin-top:0;">
  		<li v-for="item in hrs" :class="{ active: currentSession?item.username === currentSession.username:false }" :key="item.id" v-on:click="changeCurrentSession(item)"><!--   :class="[item.id === currentSessionId ? 'active':'']" -->
  			<img class="avatar" :src="item.userface" :alt="item.name">
  			<!-- <p class="name"><el-badge :s-dot="isdot[currentHr.username+'-'+item.username]==null?false:isdot[currentHr.username+'-'+item.username]">{{item.name}}</el-badge></p> -->
				<p class="name"><el-badge :is-dot="isdot[currentHr.username+'-'+item.username]">{{item.name}}</el-badge></p>
				<!-- <p class="name">{{item.name}}</p> -->
  		</li>
  	</ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'list',
  data () {
    return {
      
    }
  },
  computed: mapState([
	'hrs',
	'isdot',
	'currentHr',
  'currentSession'
	]),
  methods:{
  	changeCurrentSession:function (currentSession) {
  		this.$store.commit('changeCurrentSession',currentSession)
  	}
  }
}
</script>

<style lang="scss" scoped>
#list {
	li {
		padding: 0px 15px;
		border-bottom: 1px solid #292C33;
		list-style: none;
		cursor: pointer;
		&:hover {
			background-color: rgba(255, 255, 255, 0.03);
		}
	}
  li.active {/*注意这个是.不是冒号:*/
			background-color: rgba(255, 255, 255, 0.1);
	}
	.avatar {
		border-radius: 2px;
		width: 30px;
		height: 30px;
		vertical-align: middle;
	}
	.name {
		display: inline-block;
		margin-left: 15px;
	}
}
</style>
